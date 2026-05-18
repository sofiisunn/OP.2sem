'use strict';

export function log(level) {
    return function(fn) {
        return function(...args) {
            try {
                const result = fn(...args);

                if (level === 'INFO') {
                    console.log('INFO args:', args);
                    console.log('INFO result:', result);
                }
                if (level === 'DEBUG') {
                    console.log('DEBUG args:', args);
                    console.log('DEBUG result:', result);
                }
                return result;
            }
            catch (error) {
                if (level === 'ERROR') {
                    console.log('ERROR:', error);
                }
                throw error;
            }    
        }
    }
}
