export type ThemeTokens = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  radius: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export const theme: { light: ThemeTokens; dark: ThemeTokens } = {
  light: {
    background: "#FCFBFB",
    foreground: "oklch(0.18 0.01 60)",
    card: "oklch(0.99 0.005 75)",
    cardForeground: "oklch(0.18 0.01 60)",
    popover: "oklch(0.99 0.005 75)",
    popoverForeground: "oklch(0.18 0.01 60)",
    primary: "oklch(0.22 0.01 60)",
    primaryForeground: "oklch(0.97 0.008 75)",
    secondary: "oklch(0.93 0.012 75)",
    secondaryForeground: "oklch(0.22 0.01 60)",
    muted: "oklch(0.94 0.01 75)",
    mutedForeground: "oklch(0.48 0.02 60)",
    accent: "oklch(0.93 0.012 75)",
    accentForeground: "oklch(0.22 0.01 60)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.89 0.015 75)",
    input: "oklch(0.89 0.015 75)",
    ring: "oklch(0.22 0.01 60)",
    chart1: "oklch(0.87 0 0)",
    chart2: "oklch(0.556 0 0)",
    chart3: "oklch(0.439 0 0)",
    chart4: "oklch(0.371 0 0)",
    chart5: "oklch(0.269 0 0)",
    radius: "0.75rem",
    sidebar: "oklch(0.96 0.008 75)",
    sidebarForeground: "oklch(0.18 0.01 60)",
    sidebarPrimary: "oklch(0.22 0.01 60)",
    sidebarPrimaryForeground: "oklch(0.97 0.008 75)",
    sidebarAccent: "oklch(0.93 0.012 75)",
    sidebarAccentForeground: "oklch(0.22 0.01 60)",
    sidebarBorder: "oklch(0.89 0.015 75)",
    sidebarRing: "oklch(0.22 0.01 60)",
  },
  dark: {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    cardForeground: "oklch(0.985 0 0)",
    popover: "oklch(0.205 0 0)",
    popoverForeground: "oklch(0.985 0 0)",
    primary: "oklch(0.922 0 0)",
    primaryForeground: "oklch(0.205 0 0)",
    secondary: "oklch(0.269 0 0)",
    secondaryForeground: "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    mutedForeground: "oklch(0.708 0 0)",
    accent: "oklch(0.269 0 0)",
    accentForeground: "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.556 0 0)",
    chart1: "oklch(0.87 0 0)",
    chart2: "oklch(0.556 0 0)",
    chart3: "oklch(0.439 0 0)",
    chart4: "oklch(0.371 0 0)",
    chart5: "oklch(0.269 0 0)",
    radius: "0.75rem",
    sidebar: "oklch(0.205 0 0)",
    sidebarForeground: "oklch(0.985 0 0)",
    sidebarPrimary: "oklch(0.488 0.243 264.376)",
    sidebarPrimaryForeground: "oklch(0.985 0 0)",
    sidebarAccent: "oklch(0.269 0 0)",
    sidebarAccentForeground: "oklch(0.985 0 0)",
    sidebarBorder: "oklch(1 0 0 / 10%)",
    sidebarRing: "oklch(0.556 0 0)",
  },
};

const tokenToCssVar: Record<keyof ThemeTokens, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  border: "--border",
  input: "--input",
  ring: "--ring",
  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
  radius: "--radius",
  sidebar: "--sidebar",
  sidebarForeground: "--sidebar-foreground",
  sidebarPrimary: "--sidebar-primary",
  sidebarPrimaryForeground: "--sidebar-primary-foreground",
  sidebarAccent: "--sidebar-accent",
  sidebarAccentForeground: "--sidebar-accent-foreground",
  sidebarBorder: "--sidebar-border",
  sidebarRing: "--sidebar-ring",
};

function tokensToCssBlock(tokens: ThemeTokens): string {
  return (Object.keys(tokens) as (keyof ThemeTokens)[])
    .map((key) => `${tokenToCssVar[key]}: ${tokens[key]};`)
    .join(" ");
}

export function themeStyleSheet(): string {
  return `:root { ${tokensToCssBlock(theme.light)} } .dark { ${tokensToCssBlock(theme.dark)} }`;
}
