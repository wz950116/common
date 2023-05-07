const semver = require('semver')
const { engines } = require('../../package.json')
const version = engines.node
if (!semver.satisfies(process.version, version)) {
  console.error(`请检查您的node版本,${version},got:${process.version}`)
  process.exit(1)
}
