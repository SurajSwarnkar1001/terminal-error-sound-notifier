/**
 * Class responsible for detecting errors in terminal output.
 */
export default class ErrorDetector {
    private patterns: RegExp[] = [];

    /**
     * Initializes the ErrorDetector with an array of string patterns.
     * @param {string[]} patternStrings - The regex patterns to detect errors.
     */
    constructor(patternStrings: string[]) {
        this.updatePatterns(patternStrings);
    }

    /**
     * Updates the compiled regular expressions from an array of strings.
     * Gracefully ignores invalid regex patterns.
     * @param {string[]} patternStrings - The new regex patterns.
     */
    public updatePatterns(patternStrings: string[]): void {
        this.patterns = [];
        for (const pattern of patternStrings) {
            try {
                this.patterns.push(new RegExp(pattern, 'i'));
            } catch (error) {
                console.error(`Terminal Error Sound: Invalid regex pattern skipped: "${pattern}"`);
            }
        }
    }

    /**
     * Checks if the provided text contains any of the defined error patterns.
     * Strips ANSI escape codes before matching.
     * @param {string} text - The raw terminal text.
     * @returns {boolean} True if an error pattern matches, false otherwise.
     */
    public containsError(text: string): boolean {
        if (!text) {
            return false;
        }

        // Strip ANSI escape codes
        const cleanText = text.replace(/\x1B\[[0-9;]*[mGKHF]/g, '');

        for (const regex of this.patterns) {
            if (regex.test(cleanText)) {
                return true;
            }
        }
        return false;
    }
}

export { ErrorDetector };
