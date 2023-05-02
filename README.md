# Translate i18n files

A translation tool that helps to automatically update missing translations in a JSON language file using Google Translate API.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a Google Cloud account with billing enabled.
- You have set up a project in the Google Cloud Console and enabled the Cloud Translation API.
- You have generated an API key for your project.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/codama-dev/translate-i18n-files.git
```

2. Change the current directory to the project folder:

```bash
cd translation-tool
```

3. Install the required packages:

```bash
npm install
```

## Usage

1. Copy the `.example.env` file, rename it to `.env`, and add your Google Translate API key

2. Save your source and target language JSON files in the `files` directory, using the following naming convention:

- Source language file: `files/en.json`
- Target language file: `files/he.json`

3. Run the script:

```bash
node index.js
```

4. The script will update the target language file with missing translations and create a report in the `reports` directory.

5. Make sure you have the Prettier plugin installed in your IDE for code formatting. Check the [official documentation](https://prettier.io/docs/en/editors.html) for instructions on how to install and set up Prettier for your specific IDE.

## License

This project is licensed under the MIT License.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
