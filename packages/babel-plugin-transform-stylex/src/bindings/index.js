/**
 * Copyright (c) Ladifire, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {
  isPropertyCall,
} = require("../utils");
const handleCreateBindings = require("./handleCreateBindings");

require("../utils/pollyfils.js");

function handleBinding(node, opts, path) {
  if (node.parentPath.isCallExpression()) return [];

  if (isPropertyCall(node, 'create')) {
    return handleCreateBindings(node, opts, path);
  }

  return ".aaa{color: red;}"
}

module.exports = function (bindings, opts, path) {
  return bindings
    // sort to process keyframes first
    .sort(function(binding) {
      return isPropertyCall(binding, 'keyframes') ? -1 : 1;
    })
    .flatMap(function(node) {
      return handleBinding(node, opts, path)
    });
};
