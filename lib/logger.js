'use strict';

export function log(level, logger) {
    return function (fn) {
        return function (...args) {
            const timestamp = new Date().toISOString();
            const start = performance.now();

            const emit = (obj) => {
                if (typeof logger === 'function') {
                    logger(obj);
                }
            };

            try {
                const result = fn(...args);

                const isPromise = result && typeof result.then === 'function';

                if (isPromise) {
                    return result
                        .then((res) => {
                            if (level !== 'ERROR') {
                                emit({
                                    timestamp,
                                    level,
                                    args,
                                    result: res,
                                    time: performance.now() - start,
                                    error: null
                                });
                            }
                            return res;
                        })
                        .catch((error) => {
                            if (level === 'ERROR') {
                                emit({
                                    timestamp,
                                    level,
                                    args,
                                    result: null,
                                    time: null,
                                    error
                                });
                            }
                            throw error;
                        }) 
                }

                const res = result;

                if (level !== 'ERROR') {
                    emit({
                        timestamp,
                        level,
                        args,
                        result: res,
                        time: performance.now() - start,
                        error: null
                    }) 
                }

                return res;

            } catch (error) {
                if (level === 'ERROR') {
                    emit({
                        timestamp,
                        level,
                        args,
                        result: null,
                        time: null,
                        error
                    })
                }
                throw error;
            }
        }
    }
}