/**
 * Copyright (c) Ladifire, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const babel = require('@babel/core');
const babelPlugin = require("@ladifire-opensource/babel-plugin-transform-stylex");
const loaderUtils = require('loader-utils');
// const virtualModules = require('./src/virtualModules.js');
const path = require('path');

const virtualModules = require('./virtualModules');

async function stylexLoader(input, inputSourceMap) {
  const {
    inlineLoader = '',
    outputCSS = true,
    ...options
  } = loaderUtils.getOptions(this) || {};

  this.async();

  const { code, map, metadata } = await babel.transformAsync(input, {
    plugins: [[babelPlugin, options]],
    inputSourceMap: inputSourceMap || true,
    sourceFileName: this.resourcePath,
    filename: path.basename(this.resourcePath),
    sourceMaps: true
  });

  try {
    if (metadata.stylex === undefined) {
      this.callback(null, input, inputSourceMap);
    } else if (!outputCSS) {
      this.callback(null, code, map);
    } else {
      const cssPath = loaderUtils.interpolateName(
        this,
        '[path][name].[hash:base64:7].css',
        {
          content: metadata.stylex
        }
      );

      virtualModules.writeModule(cssPath, metadata.stylex);

      const postfix = `import '${inlineLoader + cssPath}';`;
      this.callback(null, code + postfix, map);
    }
  } catch(error) {
    console.log("error: ", error)
  }
}

module.exports = stylexLoader;
