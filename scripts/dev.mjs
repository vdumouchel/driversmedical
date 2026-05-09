#!/usr/bin/env node
import { execSync, spawn } from "node:child_process";

const args = process.argv.slice(2);

function resolvePort() {
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--port" || args[i] === "-p") && args[i + 1]) return args[i + 1];
    if (args[i].startsWith("--port=")) return args[i].slice(7);
  }
  return process.env.PORT ?? "3000";
}

const port = resolvePort();

try {
  const pids = execSync(`lsof -ti:${port}`, { stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim();
  if (pids) {
    const list = pids.split(/\s+/).join(" ");
    console.log(`Freeing port ${port} (PID ${list})`);
    execSync(`kill -9 ${list}`, { stdio: "ignore" });
  }
} catch {
  // nothing listening
}

const hasPort = args.some((a) => a === "--port" || a === "-p" || a.startsWith("--port="));
const nextArgs = ["dev", ...args, ...(hasPort ? [] : ["--port", String(port)])];

const child = spawn("next", nextArgs, { stdio: "inherit" });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
