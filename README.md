# Terminal Error Sound Notifier 🔔
**Version:** 1.0.0 (Initial Release - First Version!)

Stop staring at your terminal waiting for a crash! This VS Code extension automatically detects errors (like failed builds, panics, or exceptions) and triggers custom sound alerts. Make debugging a little less painful and a lot more fun with 38+ built-in meme sounds or your own custom audio tracks!

## 🚀 Features

### 🎵 1. Play 38+ Built-in Meme Sounds
Bored of the standard error "beep"? This extension comes loaded with **38+ funny and famous meme sounds** (e.g., *"Moye Moye"*, *"Chal Jhoota"*, *"Laughing Meow"*, *"Aayie dekhte hai"*, etc.). 
- Simply open your VS Code Settings (`Ctrl + ,`).
- Search for `Terminal Error Sound: Built In Sound`.
- Select your favorite meme from the dropdown menu, and it will play automatically the next time your code fails!

### 🎧 2. Completely Custom Sounds (.mp3 / .wav)
Want a very specific song, a custom recorded voice line, or a specific audio effect to play when your code crashes? You can easily map the extension to **any audio file on your computer**:
- Go to Settings (`Ctrl + ,`) and set `Terminal Error Sound: Built In Sound` to **"Custom"**.
- Below it, in the `Terminal Error Sound: Custom Sound Path` setting, paste the **exact absolute path** of your sound file.
  - *Example (Windows):* `C:\Users\Username\Downloads\my-favorite-song.mp3`
  - *Example (Mac):* `/Users/Username/Music/alert.wav`
- The extension will validate your file and play it exactly as is!

### ⏱️ 3. Infinite Playback & Max Duration Limits
Whether your sound is a quick 1-second meme or a full 5-minute song, the extension handles it perfectly:
- **Play Full Audio:** By default, the `Max Duration` setting is set to **`0`**. This means the sound will play to its natural end, no matter how long it is!
- **Enforce a Cutoff:** If your custom song is too long and you only want to hear the first 3 seconds, simply change the `Terminal Error Sound: Max Duration` setting to `3`. The sound will be automatically muted after exactly 3 seconds.

### 🤖 4. Smart Error Detection
The extension actively listens to your terminal output for customizable keywords. By default, it detects terms like `Error:`, `Exception`, `FAILED`, `panic:`, and `Traceback`. You can easily add or remove these specific keywords from the `Terminal Error Sound: Error Patterns` setting.

---

## 🛠️ Requirements & Compatibility

- **VS Code:** `v1.74.0` or higher (Uses the `terminalDataWriteEvent` API).
- **Windows:** PowerShell must be accessible (Uses `Media.SoundPlayer` and `System.Windows.Media.MediaPlayer`).
- **macOS:** Uses the built-in `afplay` command.
- **Linux:** Requires `paplay` (pulseaudio-utils) or `aplay` (alsa-utils).

---

## ⚙️ Configuration Settings Table

You can customize the following settings inside your VS Code `settings.json`:

| Setting | Type | Default | Description |
| ------- | ---- | ------- | ----------- |
| `terminalErrorSound.enable` | `boolean` | `true` | Quickly toggle the error sounds on or off. |
| `terminalErrorSound.builtInSound` | `string` | `default` | Select from the massive list of 38+ memes/audio files, or select **`Custom`** to use your own path. |
| `terminalErrorSound.customSoundPath` | `string` | `""` | The absolute path to your local `.mp3`, `.wav`, or `.ogg` file. (Only works if `Built-in Sound` is set to `Custom`). |
| `terminalErrorSound.maxDuration` | `number` | `0` | Cuts off playback after `X` seconds. Set to `0` to let the audio play through its entire natural length. |
| `terminalErrorSound.volume` | `number` | `80` | Adjusts sound volume (`0` to `100`). |
| `terminalErrorSound.errorPatterns` | `string[]` | *[Array]* | Regex and word patterns used to detect whether the terminal text contains an error. |

---

## 🕹️ Useful Commands

Open the VS Code Command Palette (`Ctrl + Shift + P` or `Cmd + Shift + P`) to use these features instantly:

* **🔊 `Terminal Error Sound: Test Sound`**: Want to preview the sound you just selected without waiting for your code to actually crash? Run this command to play it instantly. This also shows a helpful popup verifying exactly which file was loaded.
* **✅ `Terminal Error Sound: Enable`**: Turns the visual error tracking back on.
* **🔇 `Terminal Error Sound: Disable`**: Silences the watcher for when you need quiet focus time.

---

## 👨‍💻 Contributing

Open to pull requests and issues! Make sure you `npm install` and run `npm run compile` to test locally.

**License:** MIT
