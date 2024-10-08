import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import { getConfig } from "./config";

export class AudioPlayer {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async playRoast(roast: string) {
    const validVoices = ["echo", "alloy", "fable", "onyx", "nova", "shimmer"];
    const voice = validVoices[Math.floor(Math.random() * validVoices.length)];
    const config = getConfig();

    const speechResponse = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        model: "tts-1-hd",
        voice,
        input: roast,
      },
      {
        headers: {
          Authorization: `Bearer ${config["OPENAI_API_KEY"]}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const speechFilePath = path.join(this.context.extensionPath, "speech.mp3");
    fs.writeFileSync(speechFilePath, Buffer.from(speechResponse.data));

    this.playAudioFile(speechFilePath);
  }

  private playAudioFile(filePath: string) {
    const platform = process.platform;
    let command;

    if (platform === "win32") {
      command = `start ${filePath}`;
    } else if (platform === "darwin") {
      command = `afplay ${filePath}`;
    } else {
      command = `xdg-open ${filePath}`;
    }

    child_process.exec(command, (error) => {
      if (error) {
        vscode.window.showErrorMessage("Error playing audio: " + error.message);
      }
    });
  }
}
