import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Sanity Studio is a separate sub-project with its own config/lint
    // (npm --prefix sanity run ...); its build output and deps are huge
    // generated bundles that crash ESLint with an OOM if linted here.
    "sanity/**",
  ]),
]);

export default eslintConfig;
