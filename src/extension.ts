import type { ExtensionContext } from "vscode";
import { CodeRoaster } from "./CodeRoaster";

export function activate(context: ExtensionContext) {
  console.log("Code Roaster is active!");

  const codeRoaster = new CodeRoaster(context);
  codeRoaster.registerCommands();
}

export function deactivate() {}
