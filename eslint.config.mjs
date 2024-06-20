/*eslint no-unused-vars: "error"*/

import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    rules: {
      "no-unused-vars":"off",
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    ignores: ["**/node_modules/", "**/dist/"],
  }
);
