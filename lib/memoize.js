'use strict';

export function memoize(fn, limit = Infinity, ttl = Infinity) {
    const cache = new Map();
    return function funct(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            const cached = cache.get(key);
            if (Date.now() - cached.time > ttl) {
                cache.delete(key);
            }
            else {
                cache.delete(key);
                cache.set(key, cached);
                return cached.value;
            }
        }
        const mem = fn(...args);
        if (cache.size >= limit) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        cache.set(key, { value: mem, time: Date.now() });
        return mem;
    }
}

