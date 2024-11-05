import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import ts from "@typescript-eslint/parser"; // Correct import for the parser
import tsPlugin from "@typescript-eslint/eslint-plugin"; // Correct import for the plugin

export default tsPlugin.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, tsPlugin.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: ts, // Set the parser here
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disable unused vars rule
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
