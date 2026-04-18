import Link from "next/link";
import { TruckElectric } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export default async function IntakeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-center h-16 border-b border-border/30">
        <Link href={`/${lang}/`} className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <TruckElectric className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground">
            {SITE_NAME}
          </span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
