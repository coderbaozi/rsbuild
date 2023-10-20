import path from 'path';
import { build } from '@scripts/shared';
import { webpackOnlyTest } from '@scripts/helper';
import { expect } from '@playwright/test';

const commonConfig = {
  cwd: __dirname,
  entry: { index: path.resolve(__dirname, './src/main.ts') },
  rsbuildConfig: {
    tools: {
      bundlerChain: (chain: any) => {
        chain.externals(['styled-components']);
      },
    },
    output: {
      disableMinimize: true,
    },
  },
};

const noStyledConfig = {
  ...commonConfig,
  rsbuildConfig: {
    ...commonConfig.rsbuildConfig,
    tools: {
      ...commonConfig.rsbuildConfig.tools,
      styledComponents: false as const,
    },
  },
};

// TODO: needs builtin:swc-loader
webpackOnlyTest('should allow to disable styled-components', async () => {
  const rsbuild = await build(noStyledConfig);
  const files = await rsbuild.unwrapOutputJSON();

  const content =
    files[Object.keys(files).find((file) => file.endsWith('.js'))!];
  expect(content).toContain('div(');
});

// TODO: needs builtin:swc-loader
webpackOnlyTest('should transform styled-components by default', async () => {
  const rsbuild = await build(commonConfig);
  const files = await rsbuild.unwrapOutputJSON();

  const content =
    files[Object.keys(files).find((file) => file.endsWith('.js'))!];

  expect(content).toContain('div.withConfig');
});