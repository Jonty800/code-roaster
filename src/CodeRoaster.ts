import * as vscode from "vscode";
import { RoastGenerator } from "./RoastGenerator";
import { AudioPlayer } from "./AudioPlayer";

export class CodeRoaster {
  private context: vscode.ExtensionContext;
  private roastGenerator: RoastGenerator;
  private audioPlayer: AudioPlayer;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.roastGenerator = new RoastGenerator();
    this.audioPlayer = new AudioPlayer(context);
  }

  registerCommands() {
    let disposable = vscode.workspace.onDidSaveTextDocument(() => {
      this.roastCurrentFile();
    });

    this.context.subscriptions.push(disposable);

    let roastCommand = vscode.commands.registerCommand(
      "code-roaster.roastMyCode",
      async () => {
        await this.roastCurrentFile();
      }
    );

    this.context.subscriptions.push(roastCommand);
  }

  private async roastCurrentFile() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      try {
        const code = editor.document.getText();
        const roast = await this.roastGenerator.generateRoast(code);
        await this.audioPlayer.playRoast(roast);

        vscode.window.showInformationMessage(
          "Code Roaster has reviewed your recent changes",
          {
            modal: true,
            detail: roast,
          }
        );
      } catch (error) {
        console.error("Error roasting code:", error);
        vscode.window.showErrorMessage(JSON.stringify(error));
      }
    } else {
      vscode.window.showErrorMessage(
        "No active editor found. Open a file to roast!"
      );
    }
  }
}
