
function isValidEmail(emailString) {
    if (typeof emailString !== 'string') return false;

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(emailString.trim());
}

module.exports = {
    isValidEmail
};