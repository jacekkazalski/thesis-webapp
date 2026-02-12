const globals = require("globals");
const nPlugin = require("eslint-plugin-n");
const promisePlugin = require("eslint-plugin-promise");
const importPlugin = require("eslint-plugin-import");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  { ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"] },

  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // CommonJS
      globals: { ...globals.node, ...globals.es2021 },
    },
    plugins: {
      n: nPlugin,
      promise: promisePlugin,
      import: importPlugin,
    },
    settings: {
      "import/resolver": { node: true },
    },
    rules: {
      // core
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-debugger": "warn",
      "no-console": "off",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],

      // async/promise
      ...promisePlugin.configs.recommended.rules,

      // node (plugin-n)
      "n/no-missing-require": "error",
      "n/no-process-exit": "off",

      // imports
      "import/no-duplicates": "error",
    },
  },

  // na końcu (prettier compatibility)
  eslintConfigPrettier,
];
