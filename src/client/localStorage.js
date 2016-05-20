// local storage wrapper working with JSON
export default {
    getItem(key, defaultValue) {
        const dataStr = localStorage.getItem(key);
        if (dataStr) {
            return JSON.parse(dataStr);
        }
        return defaultValue;
    },
    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
};
