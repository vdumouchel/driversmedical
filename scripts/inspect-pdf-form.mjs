#!/usr/bin/env node
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFName,
  PDFOptionList,
  PDFRadioGroup,
  PDFTextField,
  StandardFonts,
} from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const defaultPdfPath = path.join(projectRoot, "public/pdf/New Brunswick - CSS-FOL-78-9282E.pdf");

function usage() {
  console.log(`Usage:
  pnpm pdf:inspect-form [pdf-path] [--summary-only] [--write-sample] [--output path]

Defaults to:
  ${path.relative(projectRoot, defaultPdfPath)}

Options:
  --summary-only   Prints counts and the smoke-fill verdict without every field name.
  --write-sample   Writes a smoke-test PDF with sample field values.
  --output path    Output path for --write-sample.
`);
}

function parseArgs(argv) {
  const args = [...argv];
  let pdfPath = defaultPdfPath;
  let summaryOnly = false;
  let writeSample = false;
  let outputPath = path.join(projectRoot, "public/pdf/pdf-lib-fill-test.pdf");

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--") continue;

    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }

    if (arg === "--write-sample") {
      writeSample = true;
      continue;
    }

    if (arg === "--summary-only") {
      summaryOnly = true;
      continue;
    }

    if (arg === "--output") {
      const next = args[i + 1];
      if (!next) throw new Error("--output requires a path");
      outputPath = path.resolve(projectRoot, next);
      i += 1;
      continue;
    }

    if (arg.startsWith("--output=")) {
      outputPath = path.resolve(projectRoot, arg.slice("--output=".length));
      continue;
    }

    if (arg.startsWith("-")) throw new Error(`Unknown option: ${arg}`);
    pdfPath = path.resolve(projectRoot, arg);
  }

  return { pdfPath, summaryOnly, writeSample, outputPath };
}

function fieldType(field) {
  if (field instanceof PDFTextField) return "text";
  if (field instanceof PDFCheckBox) return "checkbox";
  if (field instanceof PDFRadioGroup) return "radio";
  if (field instanceof PDFDropdown) return "dropdown";
  if (field instanceof PDFOptionList) return "option-list";
  return field.constructor?.name ?? "unknown";
}

function fieldOptions(field) {
  if (
    field instanceof PDFDropdown ||
    field instanceof PDFOptionList ||
    field instanceof PDFRadioGroup
  ) {
    return field.getOptions();
  }

  return [];
}

function fieldValue(field) {
  if (field instanceof PDFTextField) return field.getText() ?? "";
  if (field instanceof PDFCheckBox) return field.isChecked() ? "checked" : "unchecked";
  if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
    return field.getSelected().join(", ");
  }
  if (field instanceof PDFRadioGroup) return field.getSelected() ?? "";
  return "";
}

function fieldFlags(field) {
  const flags = [];
  if (field.isReadOnly()) flags.push("read-only");
  if (field.isRequired()) flags.push("required");
  if (!field.isExported()) flags.push("not-exported");
  return flags;
}

function widgetCount(field) {
  return field.acroField?.getWidgets?.().length ?? 0;
}

function summarizeField(field, index) {
  const options = fieldOptions(field);
  const flags = fieldFlags(field);
  const currentValue = fieldValue(field);

  console.log(`${index + 1}. ${field.getName()}`);
  console.log(`   Type: ${fieldType(field)}`);
  console.log(`   Widgets: ${widgetCount(field)}`);
  if (flags.length > 0) console.log(`   Flags: ${flags.join(", ")}`);
  if (field instanceof PDFTextField) {
    const maxLength = field.getMaxLength();
    if (maxLength !== undefined) console.log(`   Max length: ${maxLength}`);
  }
  if (currentValue) console.log(`   Current value: ${currentValue}`);
  if (options.length > 0) console.log(`   Options: ${options.join(", ")}`);
}

function tryFillField(field) {
  if (field.isReadOnly()) return { ok: false, reason: "read-only" };

  try {
    if (field instanceof PDFTextField) {
      const maxLength = field.getMaxLength();
      const sample = maxLength === undefined ? `pdf-lib test: ${field.getName().slice(0, 40)}` : "x".repeat(maxLength);
      field.setText(sample);
      return { ok: true };
    }

    if (field instanceof PDFCheckBox) {
      field.check();
      return { ok: true };
    }

    if (field instanceof PDFRadioGroup || field instanceof PDFDropdown) {
      const [firstOption] = field.getOptions();
      if (!firstOption) return { ok: false, reason: "no options" };
      field.select(firstOption);
      return { ok: true };
    }

    if (field instanceof PDFOptionList) {
      const [firstOption] = field.getOptions();
      if (!firstOption) return { ok: false, reason: "no options" };
      field.select(firstOption);
      return { ok: true };
    }

    return { ok: false, reason: `unsupported field class: ${field.constructor?.name ?? "unknown"}` };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
}

async function loadPdf(bytes) {
  try {
    return { pdfDoc: await PDFDocument.load(bytes), ignoredEncryption: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("encrypted")) throw error;

    return {
      pdfDoc: await PDFDocument.load(bytes, { ignoreEncryption: true }),
      ignoredEncryption: true,
    };
  }
}

function getAcroFormInfo(pdfDoc) {
  const acroFormRef = pdfDoc.catalog.get(PDFName.of("AcroForm"));
  if (!acroFormRef) return { hasAcroForm: false, hasXfa: false };

  const acroForm = pdfDoc.context.lookup(acroFormRef);
  const hasXfa = Boolean(acroForm?.get?.(PDFName.of("XFA")));
  return { hasAcroForm: true, hasXfa };
}

function safePageCount(pdfDoc) {
  try {
    return { count: pdfDoc.getPageCount(), error: null };
  } catch (error) {
    return { count: null, error: error instanceof Error ? error.message : String(error) };
  }
}

const { pdfPath, summaryOnly, writeSample, outputPath } = parseArgs(process.argv.slice(2));

if (!existsSync(pdfPath)) {
  console.error(`PDF not found: ${pdfPath}`);
  process.exit(1);
}

const bytes = await readFile(pdfPath);
const { pdfDoc, ignoredEncryption } = await loadPdf(bytes);
const form = pdfDoc.getForm();
const fields = form.getFields();
const { hasAcroForm, hasXfa } = getAcroFormInfo(pdfDoc);
const pageCount = safePageCount(pdfDoc);

console.log(`PDF: ${path.relative(projectRoot, pdfPath)}`);
console.log(`Pages: ${pageCount.count ?? "unavailable"}`);
if (pageCount.error) console.log(`Page tree error: ${pageCount.error}`);
console.log(`Loaded with ignoreEncryption: ${ignoredEncryption ? "yes" : "no"}`);
console.log(`AcroForm present: ${hasAcroForm ? "yes" : "no"}`);
console.log(`XFA present: ${hasXfa ? "yes" : "no"}`);
console.log(`Fields found by pdf-lib: ${fields.length}`);
console.log("");

if (fields.length === 0) {
  if (hasXfa) {
    console.log(
      "Verdict: This PDF appears to use XFA form data. pdf-lib cannot fill XFA forms by field name.",
    );
  } else {
    console.log(
      "Verdict: pdf-lib did not find AcroForm fields, so filling would require coordinates or a fillable AcroForm version of the PDF.",
    );
  }
  process.exit(0);
}

if (!summaryOnly) {
  console.log("Fields:");
  fields.forEach(summarizeField);
  console.log("");
}

const fillResults = fields.map((field) => ({ name: field.getName(), ...tryFillField(field) }));
const fillableCount = fillResults.filter((result) => result.ok).length;
const skipped = fillResults.filter((result) => !result.ok);

console.log(`Smoke fill result: ${fillableCount}/${fields.length} fields accepted a sample value.`);
if (skipped.length > 0) {
  console.log("Skipped/failed fields:");
  skipped.forEach((result) => console.log(`- ${result.name}: ${result.reason}`));
}

if (fillableCount > 0) {
  console.log("");
  console.log("Verdict: Yes. pdf-lib can address this PDF by form field name; coordinates are not required for the fields above.");
} else {
  console.log("");
  console.log("Verdict: Fields were detected, but none accepted sample values. Check read-only flags or unsupported field types.");
}

if (writeSample) {
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  form.updateFieldAppearances(font);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, await pdfDoc.save());
  console.log(`Sample written to: ${path.relative(projectRoot, outputPath)}`);
}
