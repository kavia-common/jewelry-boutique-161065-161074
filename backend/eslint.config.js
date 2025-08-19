/** @type {import("eslint").FlatConfig[]} */
const jsConfig = {
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
  },
  rules: {
    semi: ['error', 'always'],
    // Allow template literals for multi-line SQL and docs while enforcing single quotes elsewhere
    quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
  },
};

const ignoreConfig = {
  ignores: ['node_modules/**'],
};

module.exports = [ignoreConfig, jsConfig];