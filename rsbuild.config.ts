import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const { publicVars } = loadEnv({ prefixes: ['REACT_APP_'] });

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  source: {
    define: publicVars,
  },
  html: {
    title: 'News Aggregator',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
