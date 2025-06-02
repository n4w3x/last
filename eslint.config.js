import js from "@eslint/js"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import jsxA11y from "eslint-plugin-jsx-a11y"
import importPlugin from "eslint-plugin-import"
import prettier from "eslint-config-prettier"
import globals from "globals"

export default [
  {
    ignores: ["node_modules", "dist", "build"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      indent: ["error", 2],
      "no-underscore-dangle": 0,
      "react/no-unused-state": 0,
      "no-unused-vars": 0,
      "react/state-in-constructor": 0,
      "jsx-a11y/label-has-associated-control": 0,
      "react/jsx-props-no-spreading": 0,
      "linebreak-style": [0, "unix"],
      quotes: ["error", "single"],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": 0,
      "import/no-unresolved": [2, { caseSensitive: false }],
      "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
      "import/order": [
        2,
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],
      ...prettier.rules,
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          moduleDirectory: ["node_modules", "src/"],
        },
      },
      react: {
        version: "detect",
      },
    },
  },
]
