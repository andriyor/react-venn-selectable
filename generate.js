const generate = require('typescript-proptypes-generator').default;

generate({
  tsConfig: './tsconfig.json',
  inputPattern: 'src/*.tsx',
  outputDir: 'src/props',
  prettierConfig: '.prettierrc',
});
