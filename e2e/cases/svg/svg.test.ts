import { join } from 'path';
import { expect, test } from '@playwright/test';
import { build, getHrefByEntryName } from '@scripts/shared';

const fixtures = __dirname;

test('svg (default)', async ({ page }) => {
  const rsbuild = await build({
    cwd: join(fixtures, 'svg'),
    entry: {
      main: join(fixtures, 'svg', 'src/index.js'),
    },
    runServer: true,
  });

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  // test svgr（namedExport）
  await expect(
    page.evaluate(`document.getElementById('test-svg').tagName === 'svg'`),
  ).resolves.toBeTruthy();

  // test svg asset
  await expect(
    page.evaluate(
      `document.getElementById('test-img').src.startsWith('data:image/svg')`,
    ),
  ).resolves.toBeTruthy();

  // test svg asset in css
  await expect(
    page.evaluate(
      `getComputedStyle(document.getElementById('test-css')).backgroundImage.includes('url("data:image/svg')`,
    ),
  ).resolves.toBeTruthy();

  rsbuild.close();
});

test('svg (defaultExport component)', async ({ page }) => {
  const rsbuild = await build({
    cwd: join(fixtures, 'svg-default-export-component'),
    entry: {
      main: join(fixtures, 'svg-default-export-component', 'src/index.js'),
    },
    runServer: true,
    rsbuildConfig: {
      output: {
        svgDefaultExport: 'component',
      },
    },
  });

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  await expect(
    page.evaluate(`document.getElementById('test-svg').tagName === 'svg'`),
  ).resolves.toBeTruthy();

  rsbuild.close();
});

test('svg (url)', async ({ page }) => {
  const rsbuild = await build({
    cwd: join(fixtures, 'svg-url'),
    entry: {
      main: join(fixtures, 'svg-url', 'src/index.js'),
    },
    runServer: true,
  });

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  // test svg asset
  await expect(
    page.evaluate(
      `document.getElementById('test-img').src.includes('static/svg/app')`,
    ),
  ).resolves.toBeTruthy();

  // test svg asset in css
  await expect(
    page.evaluate(
      `getComputedStyle(document.getElementById('test-css')).backgroundImage.includes('static/svg/app')`,
    ),
  ).resolves.toBeTruthy();

  rsbuild.close();
});

// It's an old bug when use svgr in css and external react.
test('svg (external react)', async ({ page }) => {
  const rsbuild = await build({
    cwd: join(fixtures, 'svg-external-react'),
    entry: {
      main: join(fixtures, 'svg-external-react', 'src/index.js'),
    },
    runServer: true,
    rsbuildConfig: {
      output: {
        externals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
      html: {
        template: './static/index.html',
      },
    },
  });

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  // test svgr（namedExport）
  await expect(
    page.evaluate(`document.getElementById('test-svg').tagName === 'svg'`),
  ).resolves.toBeTruthy();

  // test svg asset
  await expect(
    page.evaluate(
      `document.getElementById('test-img').src.startsWith('data:image/svg')`,
    ),
  ).resolves.toBeTruthy();

  // test svg asset in css
  await expect(
    page.evaluate(
      `getComputedStyle(document.getElementById('test-css')).backgroundImage.includes('url("data:image/svg')`,
    ),
  ).resolves.toBeTruthy();

  rsbuild.close();
});

test('svg (disableSvgr)', async ({ page }) => {
  const rsbuild = await build({
    cwd: join(fixtures, 'svg-assets'),
    entry: {
      main: join(fixtures, 'svg-assets', 'src/index.js'),
    },
    runServer: true,
    rsbuildConfig: {
      output: {
        disableSvgr: true,
      },
    },
  });

  await page.goto(getHrefByEntryName('main', rsbuild.port));

  // test svg asset
  await expect(
    page.evaluate(
      `document.getElementById('test-img').src.includes('static/svg/app')`,
    ),
  ).resolves.toBeTruthy();

  // test svg asset in css
  await expect(
    page.evaluate(
      `getComputedStyle(document.getElementById('test-css')).backgroundImage.includes('static/svg/app')`,
    ),
  ).resolves.toBeTruthy();

  rsbuild.close();
});