const fs = require('fs')
const path = require('path')
const util = require('util')

const ROSETTA_DIR = './config/locales/rosetta/'
const OUTPUT_DIR = './public/locales/'

const getJson = files => {
  return files.filter(file => file.match(/.*\.json/))
}

const getYml = files => {
  // TODO read YMl and spit it out to the public folder
  files.filter(file => file.match(/.*\.yml/))
}

const gatherFiles = () => {}

const outputDirName = jsonFileName => {
  return OUTPUT_DIR + jsonFileName.replace('.json', '') + '/'
}

const writeFile = () => {}

class RosettaI18nextPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const files = fs.readdirSync(ROSETTA_DIR)
      const jsonFileNames = getJson(files)
      jsonFileNames.forEach(jsonFileName => {
        const inputFile = ROSETTA_DIR + jsonFileName
        // compilation.fileDependencies.push
        //   ? compilation.fileDependencies.push(inputFile)
        //   : compilation.fileDependencies.add(inputFile)

        const contents = fs.readFileSync(inputFile)
        const translations = JSON.parse(contents).locale.translations
        const outputDir = outputDirName(jsonFileName)

        !fs.existsSync(outputDir) && fs.mkdirSync(outputDir, { recursive: true })
        const outputFileName = outputDirName(jsonFileName) + 'translation.json'
        fs.writeFileSync(outputFileName, JSON.stringify(translations))
        // compilation.chunks.push(outputFileName)
      })

      callback()
    })
  }
}

module.exports = RosettaI18nextPlugin
