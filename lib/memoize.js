function memoize(fn) {
    return function funct(...args) {
        const mem = fn(...args);
        return mem;
    }
}

module.exports = memoize;