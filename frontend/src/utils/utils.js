export const getCsrfToken = () => {
    try {
        const match = document.cookie.match(/csrftoken=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    } catch (error) {
        console.error('Error extracting CSRF token:', error);
    }
};