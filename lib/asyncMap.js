'use strict';

function asyncMap(arr, fn, signal) {
    return new Promise((resolve, reject) => {
        const results = [];
        let completed = 0;
        for (let i = 0; i < arr.length; i++) {
            if (signal && signal.aborted) {
                return reject("Operation cancelled");
            }

        }
    })
}

module.exports = { asyncMap };