import webpackPreprocessor from '@cypress/webpack-preprocessor';
import { defineConfig } from 'cypress';

const webpackOptions = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
};

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', webpackPreprocessor({ webpackOptions }));
      // Removed dotenvPlugin related code
      return config;
    }
  }
});