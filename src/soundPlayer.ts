import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Class responsible for cross-platform sound playback.
 */
export class SoundPlayer {

    /**
     * Validates if the given sound file path exists and has a supported extension.
     * @param {string} filePath - The absolute path to the sound file.
     * @returns {boolean} True if valid, false otherwise.
     */
    public validateSoundPath(filePath: string): boolean {
        if (!fs.existsSync(filePath)) {
            return false;
        }
        const ext = path.extname(filePath).toLowerCase();
        return ext === '.mp3' || ext === '.wav' || ext === '.ogg';
    }

    /**
     * Plays the selected built-in error sound packaged with the extension.
     * @param {string} soundName - The name of the built-in sound (Bloop, Beep, Chime).
     * @param {number} volume - Volume level from 0 to 100.
     * @param {number} maxDuration - Max allowed playtime in seconds.
     * @returns {Promise<void>}
     */
    public async playBuiltIn(soundName: string, volume: number, maxDuration: number = 0): Promise<void> {
        let fileName = soundName + '.MP3';
        if (!soundName || soundName === 'Custom') fileName = 'default.MP3';

        const defaultPath = path.join(__dirname, '..', 'media', fileName);
        await this.play(defaultPath, volume, maxDuration);
    }

    /**
     * Plays the specified sound file. Platform-aware implementation.
     * @param {string} soundPath - The absolute path of the sound to play.
     * @param {number} volume - Volume level from 0 to 100.
     * @param {number} maxDuration - Max allowed playtime in seconds (0 for infinite).
     * @returns {Promise<void>}
     */
    public async play(soundPath: string, volume: number, maxDuration: number = 0): Promise<void> {
        return new Promise((resolve) => {
            try {
                let command = '';
                let args: string[] = [];
                const normalizedVolume = Math.max(0, Math.min(100, volume));

                if (process.platform === 'win32') {
                    // Use PowerShell on Windows
                    command = 'powershell';
                    const isMp3 = soundPath.toLowerCase().endsWith('.mp3');
                    if (isMp3) {
                        args = [
                            '-c',
                            `Add-Type -AssemblyName presentationCore; $player = New-Object System.Windows.Media.MediaPlayer; $player.Open([System.Uri]'${soundPath.replace(/'/g, "''")}'); $player.Play(); Start-Sleep -s 3`
                        ];
                    } else {
                        args = [
                            '-c',
                            `(New-Object Media.SoundPlayer '${soundPath.replace(/'/g, "''")}').PlaySync()`
                        ];
                    }
                } else if (process.platform === 'darwin') {
                    // Use afplay on macOS
                    const maxMacVolume = 1.0;
                    const macVolume = (normalizedVolume / 100) * maxMacVolume;
                    command = 'afplay';
                    args = [soundPath, '-v', macVolume.toString()];
                } else {
                    // Use paplay or aplay on Linux
                    command = 'paplay';
                    args = [soundPath];
                }

                const proc = child_process.spawn(command, args, {
                    detached: false,
                    stdio: 'ignore'
                });

                let timeoutId: NodeJS.Timeout | null = null;

                // Enforce max duration timeout
                if (maxDuration > 0) {
                    timeoutId = setTimeout(() => {
                        try {
                            if (!proc.killed) {
                                proc.kill();
                            }
                        } catch (e) {
                            // Ignore kill errors
                        }
                    }, maxDuration * 1000);
                }

                proc.on('error', (err) => {
                    if (timeoutId) clearTimeout(timeoutId);
                    if (process.platform === 'linux' && command === 'paplay') {
                        const fallbackProc = child_process.spawn('aplay', [soundPath], {
                            detached: false,
                            stdio: 'ignore'
                        });
                        fallbackProc.on('error', (fallbackErr) => {
                            vscode.window.showErrorMessage(`Terminal Error Sound Playback Failed: ${fallbackErr.message}`);
                            resolve();
                        });
                        fallbackProc.on('close', () => resolve());
                    } else {
                        vscode.window.showErrorMessage(`Terminal Error Sound Playback Failed: ${err.message}`);
                        resolve();
                    }
                });

                proc.on('close', () => {
                    if (timeoutId) clearTimeout(timeoutId);
                    resolve();
                });
            } catch (e: any) {
                vscode.window.showErrorMessage(`Terminal Error Sound Exception: ${e.message}`);
                resolve();
            }
        });
    }
}
