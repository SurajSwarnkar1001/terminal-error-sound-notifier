import * as vscode from 'vscode';
import { getConfig, isEnabled } from './config';
import ErrorDetector from './errorDetector';
import { SoundPlayer } from './soundPlayer';

/**
 * Activates the terminal error sound notifier extension.
 * @param {vscode.ExtensionContext} context - The context in which the extension is run.
 */
export function activate(context: vscode.ExtensionContext): void {
    console.log('Terminal Error Sound Notifier is now active!');

    const initialConfig = getConfig();
    const errorDetector = new ErrorDetector(initialConfig.errorPatterns);
    const soundPlayer = new SoundPlayer();

    // Listen for terminal command executions using stable Shell Integration APIs
    const executionStartDisposable = vscode.window.onDidStartTerminalShellExecution(async (event) => {
        if (!isEnabled()) return;

        // When a command executes, read its data stream
        const stream = event.execution.read();
        let executionOutput = '';

        for await (const data of stream) {
            executionOutput += data;
        }

        // Once the command finishes writing to the stream, check for errors
        if (errorDetector.containsError(executionOutput)) {
            const cfg = getConfig();
            if (cfg.builtInSound === 'Custom') {
                const soundPath = cfg.customSoundPath.trim();
                if (soundPath !== '') {
                    if (soundPlayer.validateSoundPath(soundPath)) {
                        await soundPlayer.play(soundPath, cfg.volume, cfg.maxDuration);
                    } else {
                        vscode.window.showWarningMessage(
                            `Terminal Error Sound: Invalid custom sound path "${soundPath}". Falling back to default.`
                        );
                        await soundPlayer.playBuiltIn('default', cfg.volume, cfg.maxDuration);
                    }
                } else {
                    await soundPlayer.playBuiltIn('default', cfg.volume, cfg.maxDuration);
                }
            } else {
                await soundPlayer.playBuiltIn(cfg.builtInSound, cfg.volume, cfg.maxDuration);
            }
        }
    });

    // Register commands
    const testSoundDisposable = vscode.commands.registerCommand('terminalErrorSound.testSound', async () => {
        try {
            vscode.window.showInformationMessage('🔊 Playing test sound...');
            const cfg = getConfig();

            if (cfg.builtInSound === 'Custom') {
                const soundPath = cfg.customSoundPath.trim();
                if (soundPath !== '') {
                    if (soundPlayer.validateSoundPath(soundPath)) {
                        await soundPlayer.play(soundPath, cfg.volume, cfg.maxDuration);
                    } else {
                        vscode.window.showWarningMessage(
                            `Terminal Error Sound: Invalid custom sound path "${soundPath}". Falling back to default.`
                        );
                        await soundPlayer.playBuiltIn('default', cfg.volume, cfg.maxDuration);
                    }
                } else {
                    await soundPlayer.playBuiltIn('default', cfg.volume, cfg.maxDuration);
                }
            } else {
                await soundPlayer.playBuiltIn(cfg.builtInSound, cfg.volume, cfg.maxDuration);
            }
        } catch (e: any) {
            vscode.window.showErrorMessage(`Terminal Error Sound Test Error: ${e.message}`);
        }
    });

    const enableDisposable = vscode.commands.registerCommand('terminalErrorSound.enable', async () => {
        await vscode.workspace.getConfiguration('terminalErrorSound').update('enable', true, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('✅ Terminal Error Sound enabled');
    });

    const disableDisposable = vscode.commands.registerCommand('terminalErrorSound.disable', async () => {
        await vscode.workspace.getConfiguration('terminalErrorSound').update('enable', false, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('🔇 Terminal Error Sound disabled');
    });

    // Listen for config changes
    const configChangeDisposable = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('terminalErrorSound')) {
            const newCfg = getConfig();
            errorDetector.updatePatterns(newCfg.errorPatterns);
        }
    });

    // Push all disposables to context.subscriptions
    context.subscriptions.push(
        executionStartDisposable,
        testSoundDisposable,
        enableDisposable,
        disableDisposable,
        configChangeDisposable
    );
}

/**
 * Deactivates the terminal error sound notifier extension.
 */
export function deactivate(): void {
    // Disposables are automatically cleaned up.
}
