'use strict';

export function memoize(fn, limit = Infinity) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            const cached = cache.get(key);
            return cached;
        }

        const result = fn(...args);
        if (cache.size >= limit) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        cache.set(key, result);
        return result;
    }
}

