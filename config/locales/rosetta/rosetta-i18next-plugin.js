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
      const readdirPromise = util.promisify(fs.readdir)
      const readFilePromise = util.promisify(fs.readFile)
      const writeFilePromise = util.promisify(fs.writeFile)
      const mkdirPromise = util.promisify(fs.mkdir)
      const existsPromise = util.promisify(fs.exists)

      readdirPromise(ROSETTA_DIR).then(files => {
        const jsonFileNames = getJson(files)
        jsonFileNames.forEach(jsonFileName => {
          const inputFile = ROSETTA_DIR + jsonFileName
          compilation.fileDependencies.push
            ? compilation.fileDependencies.push(inputFile)
            : compilation.fileDependencies.add(inputFile)

          console.log(inputFile)
          console.log(compilation.fileDependencies.find(a => a == inputFile))

          readFilePromise(inputFile)
            .then(contents => {
              const translations = JSON.parse(contents).locale.translations
              const outputDir = outputDirName(jsonFileName)
              existsPromise(outputDir)
                .then(exists => {
                  return exists ? Promise.resolve() : mkdirPromise(outputDir, { recursive: true })
                })
                .then(() => {
                  const outputFileName = outputDirName(jsonFileName) + 'translation.json'
                  writeFilePromise(outputFileName, JSON.stringify(translations))
                  compilation.chunks.push(outputFileName)
                })
                .catch(e => {
                  console.log(e)
                })
            })
            .catch(e => {
              console.log(`Could not read translation files from ${ROSETTA_DIR} or write to ${OUTPUT_DIR}`, e)
            })
        })
      })

      callback()
    })
  }
}

module.exports = RosettaI18nextPlugin
