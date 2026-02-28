import * as vscode from 'vscode';

/**
 * Interface representing the extension's configuration settings.
 */
export interface ExtensionConfig {
    enable: boolean;
    builtInSound: string;
    customSoundPath: string;
    errorPatterns: string[];
    volume: number;
    maxDuration: number;
}

/**
 * Retrieves the current configuration for the Terminal Error Sound extension.
 * @returns {ExtensionConfig} The current configuration object.
 */
export function getConfig(): ExtensionConfig {
    const config = vscode.workspace.getConfiguration('terminalErrorSound');
    return {
        enable: config.get<boolean>('enable', true),
        builtInSound: config.get<string>('builtInSound', 'default'),
        customSoundPath: config.get<string>('customSoundPath', ''),
        errorPatterns: config.get<string[]>('errorPatterns', [
            "error", "Error:", "ERROR", "Exception", "exception",
            "failed", "FAILED", "Fatal", "FATAL", "panic:",
            "Traceback", "SyntaxError", "TypeError",
            "ReferenceError", "cannot find", "permission denied"
        ]),
        volume: config.get<number>('volume', 80),
        maxDuration: config.get<number>('maxDuration', 0)
    };
}

/**
 * Checks if the Terminal Error Sound extension is currently enabled.
 * @returns {boolean} True if enabled, false otherwise.
 */
export function isEnabled(): boolean {
    return vscode.workspace.getConfiguration('terminalErrorSound').get<boolean>('enable', true);
}
