const fs = require('fs')
const path = require('path')
const util = require('util')
const yaml = require('js-yaml')

const OUTPUT_DIR = './public/locales/'

const getJson = files => {
  return files.filter(file => file.match(/.*\.json/))
}

const getYml = files => {
  return files.filter(file => file.match(/.*\.yml/))
}

const outputDirName = jsonFileName => {
  return OUTPUT_DIR + jsonFileName.replace('.json', '') + '/'
}

const transformYamlDefaultsToJson = (compilation, files) => {
  const yamlFileNames = getYml(files)

  if (yamlFileNames.length != 1) {
    console.log("can't find rosetta yaml file")
    return
  }

  yamlFileNames.forEach(yamlFileName => {
    const inputFile = path.resolve(__dirname, yamlFileName)
    console.log('inputFile', inputFile)
    compilation.fileDependencies.push(inputFile)

    const contents = fs.readFileSync(inputFile)
    const yamlContents = yaml.safeLoad(contents)

    const jsonDefaultName = yamlFileName.replace('yml', 'json')
    const jsonDefaultDir = path.resolve(__dirname, jsonDefaultName)
    const existingJsonDefault = fs.readdirSync(path.resolve(__dirname)).includes(jsonDefaultName)

    if (!existingJsonDefault) {
      fs.writeFileSync(jsonDefaultDir, JSON.stringify({ locale: { translations: {} } }))
    }

    const jsonDefault = JSON.parse(fs.readFileSync(jsonDefaultDir))
    yamlContents.parts.forEach(part => {
      jsonDefault.locale.translations[part.translation.key] = part.translation.value
    })

    fs.writeFileSync(jsonDefaultDir, JSON.stringify(jsonDefault))
  })
}

const serveJsonToPublic = (compilation, files) => {
  const jsonFileNames = getJson(files)
  jsonFileNames.forEach(jsonFileName => {
    const inputFile = path.resolve(__dirname, jsonFileName)

    const contents = fs.readFileSync(inputFile)
    const translations = JSON.parse(contents).locale.translations
    const outputDir = outputDirName(jsonFileName)

    !fs.existsSync(outputDir) && fs.mkdirSync(outputDir, { recursive: true })
    const outputFileName = outputDirName(jsonFileName) + 'translation.json'
    fs.writeFileSync(outputFileName, JSON.stringify(translations))
  })
}

class RosettaI18nextPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const files = fs.readdirSync(path.resolve(__dirname))

      transformYamlDefaultsToJson(compilation, files)
      serveJsonToPublic(compilation, files)

      callback()
    })
  }
}

module.exports = RosettaI18nextPlugin
