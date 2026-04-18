import { type Messages } from "@lingui/core";
import { setI18n } from "@lingui/react/server";
import { getI18nInstance, locales } from "@/lib/i18n";
import { LinguiClientProvider } from "@/components/lingui-client-provider";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const i18n = await getI18nInstance(lang);
  setI18n(i18n);

  return (
    <LinguiClientProvider
      initialLocale={lang}
      initialMessages={i18n.messages as Messages}
    >
      {children}
    </LinguiClientProvider>
  );
}
