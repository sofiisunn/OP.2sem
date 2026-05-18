'use strict';

export function log(level) {
    return function(fn) {
        return async function(...args) {
            const timestamp = new Date().toISOString();
            function formatLog(timestamp, level, args, result, time) {
                return {
                timestamp,
                level,
                args,
                result,
                time
            };
            }
            try {
                const start = performance.now();
                const result = await fn(...args);
                const end = performance.now();
                const time = end - start;

                if (level === 'INFO') {
                    const logObj = formatLog(timestamp, level, args, result, time);
                    console.log(logObj);
                }
                if (level === 'DEBUG') {
                    const logObj = formatLog(timestamp, level, args, result, time);
                    console.log(logObj);
                }
                return result;
            }
            catch (error) {
                if (level === 'ERROR') {
                    const logObj = formatLog(timestamp, level, args, null, null);
                    console.error(logObj);
                }
                throw error;
            }    
        }
    }
}
