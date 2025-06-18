import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    files: ["**/*.{ts,tsx}", "**/*.js"],
    env: {
      browser: true,
      es2020: true,
    },
    extends: [
      js.configs.recommended,
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
      prettier,
    ],
    plugins: {
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "import/newline-after-import": ["error", { count: 1 }],
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      react: {
        version: "18.2",
      },
    },
    ignorePatterns: ["dist", ".eslintrc.cjs"],
  },
];
