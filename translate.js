import axios from 'axios'

/**
 * Translate a string using Google Translate API.
 * @param {Object} options - Options for translating the string.
 * @param {string} options.stringToTranslate - The string to translate.
 * @param {string} options.apiKey - Google Translate API key.
 * @param {string} [options.sourceLanguage='en'] - Source language of the string.
 * @param {string} [options.targetLanguage='he'] - Target language for the translation.
 * @param {number} [options.retryAttempts=3] - Number of retry attempts if translation fails.
 * @returns {Promise<string>} - The translated string.
 */
export const translateString = async (options) => {
  // Destructure options with default values
  const {
    stringToTranslate,
    apiKey,
    sourceLanguage = 'en',
    targetLanguage = 'he',
    retryAttempts = 3,
  } = options

  // Check if required parameters are provided
  if (!stringToTranslate) {
    throw new Error('stringToTranslate is required')
  }

  if (!apiKey) {
    throw new Error('apiKey is required')
  }

  // Set up the Google Translate API endpoint
  const translateUrl =
    'https://translation.googleapis.com/language/translate/v2'

  let translatedString
  let attempts = 0

  // Loop to handle retry attempts
  while (attempts < retryAttempts) {
    try {
      // Log current attempt
      console.log(
        `Translation attempt ${attempts + 1} for "${stringToTranslate}"`
      )

      // Call the Google Translate API
      const response = await axios.post(translateUrl, null, {
        params: {
          key: apiKey,
          q: stringToTranslate,
          source: sourceLanguage,
          target: targetLanguage,
        },
      })

      // Extract the translated string from the response
      translatedString = response.data.data.translations[0].translatedText

      // Log successful translation
      console.log(
        `Successfully translated "${stringToTranslate}" to "${translatedString}"`
      )

      // Exit the loop
      break
    } catch (error) {
      attempts++

      // Log the error and proceed to the next attempt
      console.error(`Translation attempt ${attempts} failed:`, error)
    }
  }

  // Check if translation was successful after all attempts
  if (!translatedString) {
    throw new Error(
      `Failed to translate string after ${retryAttempts} attempts`
    )
  }

  return translatedString
}
