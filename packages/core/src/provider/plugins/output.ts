import { posix } from 'node:path';
import {
  getDistPath,
  getFilename,
  applyOutputPlugin,
  isUseCssExtract,
  mergeChainedOptions,
} from '@rsbuild/shared';
import type { RsbuildPlugin } from '../../types';
import { RspackCssExtractPlugin } from '@rspack/core';

export const pluginOutput = (): RsbuildPlugin => ({
  name: 'rsbuild:output',

  setup(api) {
    applyOutputPlugin(api);

    api.modifyBundlerChain(async (chain, { CHAIN_ID, target, isProd }) => {
      const config = api.getNormalizedConfig();

      if (config.output.copy) {
        const { CopyRspackPlugin } = await import('@rspack/core');
        const { copy } = config.output;
        const options = Array.isArray(copy) ? { patterns: copy } : copy;

        chain.plugin(CHAIN_ID.PLUGIN.COPY).use(CopyRspackPlugin, [options]);
      }

      const cssPath = getDistPath(config, 'css');

      // css output
      if (isUseCssExtract(config, target)) {
        const extractPluginOptions = mergeChainedOptions({
          defaults: {},
          options: config.tools.cssExtract?.pluginOptions,
        });

        const cssFilename = getFilename(config, 'css', isProd);
        const cssAsyncPath = getDistPath(config, 'cssAsync');
      
        chain
          .plugin(CHAIN_ID.PLUGIN.MINI_CSS_EXTRACT)
          .use(RspackCssExtractPlugin, [
            {
              filename: posix.join(cssPath, cssFilename),
              chunkFilename: posix.join(
                cssAsyncPath,
                cssFilename,
              ),
              ignoreOrder: true,
              ...extractPluginOptions,
            },
          ]);
      }
    });
  },
});
