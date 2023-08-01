// @ts-check

/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: ['prettier-plugin-organize-imports'],
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.json5',
      options: {
        parser: 'json5',
        quoteProps: 'preserve',
        singleQuote: false,
        trailingComma: 'none',
      },
    },
  ],
};
