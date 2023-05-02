import fs from 'fs/promises'
import path from 'path'
import { translateString } from './translate.js'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.API_KEY

/**
 * Recursively update missing translations in the target object.
 * @param {Object} source - Source object containing translations.
 * @param {Object} target - Target object to update with missing translations.
 * @param {Object} report - Report object to store information about missing translations.
 * @param {string} currentPath - Current path in the translation hierarchy.
 */
const updateMissingTranslationsRecursive = async (
  source,
  target,
  report,
  currentPath
) => {
  for (const key in source) {
    const newCurrentPath = currentPath ? `${currentPath}.${key}` : key

    if (typeof source[key] === 'object') {
      if (!target.hasOwnProperty(key)) {
        target[key] = {}
      }

      await updateMissingTranslationsRecursive(
        source[key],
        target[key],
        report,
        newCurrentPath
      )
    } else {
      if (!target.hasOwnProperty(key)) {
        try {
          const translatedString = await translateString({
            stringToTranslate: source[key],
            apiKey,
          })

          target[key] = translatedString
          report.missingTranslations.push({
            key: newCurrentPath,
            value: source[key],
            translation: translatedString,
          })
        } catch (error) {
          target[key] = `HE ${source[key]}`
          report.missingTranslations.push({
            key: newCurrentPath,
            value: source[key],
          })
        }

        report.updatedTranslations++
      }
    }
  }
}

/**
 * Update missing translations in the target language file.
 * @param {string} sourceFile - Path to the source language JSON file.
 * @param {string} targetFile - Path to the target language JSON file.
 * @returns {Promise<void>}
 */
const updateMissingTranslations = async (sourceFile, targetFile) => {
  try {
    // Read and parse the source and target language files.
    const sourceContent = await fs.readFile(sourceFile, 'utf-8')
    const targetContent = await fs.readFile(targetFile, 'utf-8')
    const sourceJson = JSON.parse(sourceContent)
    const targetJson = JSON.parse(targetContent)

    // Initialize the report object.
    const report = {
      missingTranslations: [],
      updatedTranslations: 0,
    }

    // Update missing translations in the target file.
    await updateMissingTranslationsRecursive(sourceJson, targetJson, report, '')

    // Write the updated target JSON file.
    await fs.writeFile(targetFile, JSON.stringify(targetJson, null, 2), 'utf-8')

    // Generate the report and print it.
    const reportText = generateReport(report)
    console.log(reportText)

    // create the name of the file, with the current timestamp, using iso format
    const date = new Date()
    const reportFileName = `report_${date.toISOString()}.txt`

    await fs.writeFile('reports/' + reportFileName, reportText, 'utf-8')
  } catch (error) {
    console.error('Error updating translations:', error)
  }
}

/**
 * Generate a report based on the provided report object.
 * @param {Object} report - Report object with information about missing translations.
 * @returns {string} - Generated report as a string.
 */
const generateReport = (report) => {
  const reportLines = [
    'Missing Translations Report',
    '===========================',
    `Total missing translations: ${report.updatedTranslations}`,
    '',
    'Missing Translations:',
  ]

  report.missingTranslations.forEach((missingTranslation) => {
    reportLines.push(
      `- ${missingTranslation.key}: ${missingTranslation.value}${
        missingTranslation.translation
          ? ` (Translated: ${missingTranslation.translation})`
          : ''
      }`
    )
  })

  return reportLines.join('\n')
}

// Usage example
const sourceFile = path.resolve('files/en.json')
const targetFile = path.resolve('files/he.json')
updateMissingTranslations(sourceFile, targetFile)
