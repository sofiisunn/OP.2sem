'use strict';

function memoize(fn, limit = Infinity) {
    const cache = new Map();
    return function funct(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }
        const mem = fn(...args);
        if (cache.size >= limit) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        cache.set(key, mem);
        return mem;
    }
}

module.exports = memoize;