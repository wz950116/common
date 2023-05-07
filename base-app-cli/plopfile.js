const storeGenerator = require('./plop-templates/store/prompt.js')
const viewGenerator = require('./plop-templates/view/prompt.js')
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt')
module.exports = function(plop) {
  plop.setPrompt('file-tree-selection', inquirerFileTreeSelection)
  plop.setGenerator('store', storeGenerator)
  plop.setGenerator('view', viewGenerator)
}
