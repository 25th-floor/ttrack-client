/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */
const fs = require('fs');

function componentExists(comp,path) {
  return fs.readdirSync(path).indexOf(comp) >= 0;
}

module.exports = componentExists;
