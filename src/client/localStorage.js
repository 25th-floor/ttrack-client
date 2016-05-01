'use strict';

// local storage wrapper working with JSON
export default {
    getItem: function (key, defaultValue) {
        var dataStr = localStorage.getItem(key);
        if (dataStr) {
            return JSON.parse(dataStr);
        }
        return defaultValue;
    },
    setItem: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

