'use strict';

function memoize(fn) {
    const cache = new Map();
    return function funct(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        else {
            const mem = fn(...args);
            cache.set(key, mem);
            return mem;
        }
    }
}

module.exports = memoize;