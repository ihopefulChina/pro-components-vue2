module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
      },
    },
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "vue/multi-word-component-names": "off",
    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
    "vue/require-prop-types": "off",
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "vue/custom-event-name-casing": ["error", "camelCase"],
    "vue/define-macros-order": [
      "error",
      {
        order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"],
      },
    ],
    "vue/html-comment-content-spacing": ["error", "always"],
    "vue/no-empty-component-block": "error",
    "vue/no-multiple-objects-in-class": "error",
    "vue/no-static-inline-styles": "error",
    "vue/no-template-target-blank": "error",
    "vue/no-useless-mustaches": "error",
    "vue/padding-line-between-blocks": ["error", "always"],
    "vue/prefer-separate-static-class": "error",
    "vue/prefer-true-attribute-shorthand": "error",
    "vue/require-direct-export": "error",
    "vue/v-for-delimiter-style": ["error", "in"],
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        indent: "off",
      },
    },
  ],
};
