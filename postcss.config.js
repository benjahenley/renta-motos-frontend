module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss': {},
    'postcss-nesting': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': true
      }
    }
  }
}
