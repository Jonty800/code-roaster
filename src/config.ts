import path = require("path");
import fs = require("fs");
import { window, workspace } from "vscode";

export const getConfig = (): { [key: string]: string } => {
  const workspaceFolders = workspace.workspaceFolders;
  if (!workspaceFolders) {
    window.showErrorMessage("No workspace folder open");
    return {};
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const envPath = path.join(rootPath, ".env");

  const data = fs.readFileSync(envPath, "utf8");
  const variables = parseEnvFile(data);
  return variables;
};

function parseEnvFile(contents: string): { [key: string]: string } {
  const result: { [key: string]: string } = {};
  const lines = contents.split("\n");

  for (const line of lines) {
    const [key, value] = line.split("=").map((part) => part.trim());
    if (key && value) {
      result[key] = value.replace(/['"]/g, "");
    }
  }

  return result;
}

export function deactivate() {}
