const fs = require('fs')
const path = require('path')
const parse = require('csv-parse/lib/sync')

const ASSETS_DIR = './public/assets/'
const OUTPUT_DIR = './public/assets/locales/'

const getJson = files => {
  return files.filter(file => file.match(/.*\.json/))
}

const getCsv = files => {
  return files.filter(file => file.match(/.*\.csv/))
}

const outputDirName = jsonFileName => {
  return OUTPUT_DIR + jsonFileName.replace('.json', '') + '/'
}

const compileTranslations = (compilation, files) => {
  const csvFiles = getCsv(files)
  csvFiles.forEach(file => {
    // Prepare input files
    const filePath = path.resolve(__dirname, file)
    compilation.fileDependencies.add(filePath)
    const contents = fs.readFileSync(filePath)

    // Parse
    const records = parse(contents)

    // Prepare output files
    const outputJson = file.replace('csv', 'json')
    const outputPath = path.resolve(__dirname, outputJson)
    const outputFileExists = fs.readdirSync(path.resolve(__dirname)).includes(outputJson)
    if (!outputFileExists) {
      fs.writeFileSync(outputPath, JSON.stringify({ locale: { translations: {} } }))
    }
    // Clear contents
    const outputContents = JSON.parse(fs.readFileSync(outputPath))
    outputContents.locale.translations = {}

    // Populate output contents
    const body = records.slice(1)
    body.forEach(part => {
      const [key, value, _title, _screenshot, _wip] = part
      outputContents.locale.translations[key] = value
    })
    fs.writeFileSync(outputPath, JSON.stringify(outputContents, undefined, 2))
  })
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

class CompileI18nextPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const files = fs.readdirSync(path.resolve(__dirname))

      compileTranslations(compilation, files)
      serveTranslationFiles(files)

      callback()
    })
  }
}

module.exports = CompileI18nextPlugin
