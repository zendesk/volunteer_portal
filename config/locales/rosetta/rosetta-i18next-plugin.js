const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const ASSETS_DIR = './public/assets/'
const OUTPUT_DIR = './public/assets/locales/'

const getJson = files => {
  return files.filter(file => file.match(/.*\.json/))
}

const getYml = files => {
  return files.filter(file => file.match(/.*\.yml/))
}

const outputDirName = jsonFileName => {
  return OUTPUT_DIR + jsonFileName.replace('.json', '') + '/'
}

const createBaseRosettaFile = yamlFile => {
  const defaultRosettaContents = {
    title: 'volunteer_portal',
    packages: ['volunteer_portal'],
    parts: [],
  }
  const defaultRosettaContentsYml = yaml.safeLoad(JSON.stringify(defaultRosettaContents))
  fs.writeFileSync(yamlFile, yaml.safeDump(defaultRosettaContentsYml))
}

const createCompiledRosettaFile = compiledRosettaFile => {
  fs.writeFileSync(compiledRosettaFile, JSON.stringify({ locale: { translations: {} } }))
}

const compileBaseRosetta = (compilation, files) => {
  const yamlFileName = 'en.yml'
  const baseRosettaFile = path.resolve(__dirname, yamlFileName)

  const yamlFiles = getYml(files)
  if (yamlFiles.length < 1) {
    createBaseRosettaFile(baseRosettaFile)
  }

  compilation.fileDependencies.add(baseRosettaFile)

  const contents = fs.readFileSync(baseRosettaFile)
  const baseRosettaContents = yaml.safeLoad(contents)

  const compiledRosettaName = yamlFileName.replace('yml', 'json')
  const compiledRosettaFile = path.resolve(__dirname, compiledRosettaName)
  const compiledRosettaExists = fs.readdirSync(path.resolve(__dirname)).includes(compiledRosettaName)

  if (!compiledRosettaExists) {
    createCompiledRosettaFile(compiledRosettaFile)
  }

  const compiledRosettaContents = JSON.parse(fs.readFileSync(compiledRosettaFile))
  compiledRosettaContents.locale.translations = {}

  baseRosettaContents.parts.forEach(part => {
    compiledRosettaContents.locale.translations[part.translation.key] = part.translation.value
  })

  fs.writeFileSync(compiledRosettaFile, JSON.stringify(compiledRosettaContents, undefined, 2))
}

const serveTranslationFiles = files => {
  !fs.existsSync(ASSETS_DIR) && fs.mkdirSync(ASSETS_DIR)
  !fs.existsSync(OUTPUT_DIR) && fs.mkdirSync(OUTPUT_DIR)
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

      compileBaseRosetta(compilation, files)
      serveTranslationFiles(files)

      callback()
    })
  }
}

module.exports = RosettaI18nextPlugin
