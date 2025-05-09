// Reference: https://github.com/remnawave/migrate/blob/main/marzban/util/username_sanitizer.go

export function sanitizeUsername(username: string): string {
    // Define regex pattern for valid characters
    const validPattern = /^[a-zA-Z0-9_-]+$/;

    // Create an array to store valid characters
    const sanitized: string[] = [];

    // Keep only valid characters
    for (const char of username) {
        if (validPattern.test(char)) {
            sanitized.push(char);
        } else {
            // Replace invalid characters with underscore
            sanitized.push('_');
        }
    }

    // Get the sanitized username
    let result = sanitized.join('');

    // Ensure minimum length of 6 characters
    if (result.length < 6) {
        result = result + '_'.repeat(6 - result.length);
    }

    return result;
}
