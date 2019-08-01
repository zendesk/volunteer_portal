const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const getJson = files => {
  return files.filter(file => file.match(/.*\.json/))
}

const getYml = files => {
  return files.filter(file => file.match(/.*\.yml/))
}

const outputDirName = jsonFileName => {
  const OUTPUT_DIR = './public/locales/'
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
  const yamlFileName = 'en-us.yml'
  const baseRosettaFile = path.resolve(__dirname, yamlFileName)

  let yamlFiles = getYml(files)
  if (yamlFiles.length < 1) {
    createBaseRosettaFile(baseRosettaFile)
  }

  compilation.fileDependencies.push(baseRosettaFile)

  const contents = fs.readFileSync(baseRosettaFile)
  const baseRosettaContents = yaml.safeLoad(contents)

  const compiledRosettaName = yamlFileName.replace('yml', 'json')
  const compiledRosettaFile = path.resolve(__dirname, compiledRosettaName)
  const compiledRosettaExists = fs.readdirSync(path.resolve(__dirname)).includes(compiledRosettaName)

  if (!compiledRosettaExists) {
    createCompiledRosettaFile(compiledRosettaFile)
  }

  const compiledRosettaContents = JSON.parse(fs.readFileSync(compiledRosettaFile))

  baseRosettaContents.parts.forEach(part => {
    compiledRosettaContents.locale.translations[part.translation.key] = part.translation.value
  })

  fs.writeFileSync(compiledRosettaFile, JSON.stringify(compiledRosettaContents, undefined, 2))
}

const serveTranslationFiles = (compilation, files) => {
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
      serveTranslationFiles(compilation, files)

      callback()
    })
  }
}

module.exports = RosettaI18nextPlugin
