export function formatTextFromClipboard(pastedText) {
    return pastedText.replace(/'/g, "''");
}

export function formatJSONFromClipboard(pastedText) {
    try {
        const cleanedText = pastedText.replace(/\\\//g, '/').replace(/'/g, "''");
        const json = JSON.parse(cleanedText);
        return JSON.stringify(json, null, 2);
    } catch (err) {
        throw new Error('Pasted content is not valid JSON.');
    }
}
