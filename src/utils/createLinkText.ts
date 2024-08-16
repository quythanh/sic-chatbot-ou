const createLinkText = (text: string) => {
    // Regex patterns để nhận diện URLs, emails và số điện thoại
    const urlPattern = /(?:\b(?:https?|ftp|file):\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/gi;

    const emailPattern = /(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b)/gi;
    const phonePattern = /(\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4})/g;

    function replacePattern(linkedText: string, pattern: RegExp, type: 'url' | 'email' | 'phone') {
        return linkedText.replace(pattern, (match: string) => {
            let href: string;
            switch (type) {
                case 'url':
                    href = /^http/.test(match) ? match : `http://${match}`;
                    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
                case 'email':
                    href = `mailto:${match}`;
                    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
                case 'phone':
                    href = `tel:${match.replace(/[^\d+]/g, '')}`;
                    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
                default:
                    return match;
            }
        });
    }

    // Thay thế URLs, emails và số điện thoại trong văn bản
    let linkedText = replacePattern(text, urlPattern, 'url');
    linkedText = replacePattern(linkedText, phonePattern, 'phone');
    linkedText = replacePattern(linkedText, emailPattern, 'email');

    // Sử dụng dangerouslySetInnerHTML để chèn HTML
    return linkedText;
};

export default createLinkText;

