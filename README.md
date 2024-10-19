# Code Roaster

Code Roaster is a VS Code extension that provides humorous, scathing roasts of your code in the style of comedian Frankie Boyle. It uses AI to generate witty, brutal critiques of your code and even reads them aloud!

## Features

- Automatically roasts your code on save
- Command to manually trigger a code roast
- AI-generated roasts using OpenAI's GPT-4 or Anthropic's Claude
- Text-to-speech functionality to verbally deliver the roasts

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Open the project in VS Code
4. Press F5 to run the extension in debug mode

## Configuration

Create a `.env` file in the root of the project with the following content:

```
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Usage

- The extension will automatically roast your code every time you save a file.
- You can also trigger a roast manually by running the "Code Roaster: Roast My Code" command from the Command Palette (Ctrl+Shift+P).

## How it works

1. The extension captures your code when you save a file or trigger the command manually.
2. It sends the code to an AI model (either GPT-4 or Claude) with instructions to generate a scathing roast.
3. The AI-generated roast is then sent to OpenAI's text-to-speech API to create an audio version.
4. The roast is displayed as a message in VS Code and played aloud.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This extension is meant for entertainment purposes only. The roasts are AI-generated and should not be taken personally. Use at your own risk and emotional peril!

## License

[MIT License](LICENSE)
