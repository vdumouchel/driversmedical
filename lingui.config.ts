const config = {
  sourceLocale: "en",
  locales: ["en", "fr"],
  fallbackLocales: { default: "en" },
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}",
      include: ["src/"],
    },
  ],
};

export default config;
