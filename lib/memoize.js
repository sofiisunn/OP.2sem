'use strict';

export function memoize(fn, limit = 10) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            const value = cache.get(key);

            cache.delete(key);
            cache.set(key, value);

            return value;
        }

        const result = fn(...args);

        cache.set(key, result);

        if (cache.size > limit) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        return result;
    };
}
