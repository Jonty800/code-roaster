import { workspace, commands, window, ExtensionContext } from "vscode";
import { RoastGenerator } from "./RoastGenerator";
import { AudioPlayer } from "./AudioPlayer";

export class CodeRoaster {
  private context: ExtensionContext;
  private roastGenerator: RoastGenerator;
  private audioPlayer: AudioPlayer;

  constructor(context: ExtensionContext) {
    this.context = context;
    this.roastGenerator = new RoastGenerator();
    this.audioPlayer = new AudioPlayer(context);
  }

  /**
   * Registers VS Code commands and event listeners for the Code Roaster.
   * This includes setting up the auto-roast on save feature and the manual roast command.
   */
  registerCommands() {
    let disposable = workspace.onDidSaveTextDocument(() => {
      this.roastCurrentFile();
    });

    this.context.subscriptions.push(disposable);

    let roastCommand = commands.registerCommand(
      "code-roaster.roastMyCode",
      async () => {
        await this.roastCurrentFile();
      }
    );

    this.context.subscriptions.push(roastCommand);
  }

  private getRoastSettings() {
    const config = workspace.getConfiguration("codeRoaster");
    return {
      useOpenAI: config.get("useOpenAI", true),
      roastOnSave: config.get("roastOnSave", true),
      audioEnabled: config.get("audioEnabled", true),
    };
  }

  /**
   * Generates a roast for the currently active file in the VS Code editor.
   * If successful, it will display the roast in a message and optionally play it as audio.
   */
  private async roastCurrentFile() {
    const editor = window.activeTextEditor;
    if (editor) {
      try {
        const code = editor.document.getText();
        const roast = await this.roastGenerator.generateRoast(code);
        await this.audioPlayer.playRoast(roast);

        window.showInformationMessage(
          "Code Roaster has reviewed your recent changes",
          {
            modal: true,
            detail: roast,
          }
        );
      } catch (error) {
        console.error("Error roasting code:", error);
        window.showErrorMessage(JSON.stringify(error));
      }
    } else {
      window.showErrorMessage("No active editor found. Open a file to roast!");
    }
  }
}
