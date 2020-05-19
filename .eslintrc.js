module.exports = {
  extends: ['airbnb'],
  parser: 'babel-eslint',
  plugins: [
    'module-resolver',
    {
      root: '.',
      alias: {
        '_apis/*': './apis/*',
        '_actions/*': './actions/*',
        '_helpers/*': './helpers/*',
        '_assets/*': './assets/*',
        '_components/*': './screens/components/*',
        _types: './types/index',
        _typography: './theme/typography',
        _palette: './theme/palette.ts',
        _metrics: './theme/metrics',
        _globals: './theme/globals',
        _zIndex: './theme/zIndex',
        _stylesheet: './theme/stylesheet',
        _rootReducer: './reducers/index.ts',
      },
    },
  ],
};
