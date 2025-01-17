import { build, gotoPage, rspackOnlyTest } from '@e2e/helper';
import { expect } from '@playwright/test';

rspackOnlyTest(
  'should compile CSS Modules with named exports correctly',
  async ({ page }) => {
    const rsbuild = await build({
      cwd: __dirname,
      runServer: true,
    });
    const files = await rsbuild.unwrapOutputJSON();

    const content =
      files[Object.keys(files).find((file) => file.endsWith('.css'))!];

    expect(content).toMatch(
      /\.classA-\w{6}{color:red}\.classB-\w{6}{color:blue}\.classC-\w{6}{color:yellow}/,
    );

    await gotoPage(page, rsbuild);
    const root = page.locator('#root');
    const text = await root.innerHTML();

    expect(text).toMatch(/classA-\w{6} classB-\w{6} classC-\w{6}/);
    await rsbuild.close();
  },
);
