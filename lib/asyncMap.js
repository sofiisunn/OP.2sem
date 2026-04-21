'use strict';

function asyncMap(arr, fn, signal) {
    return new Promise((resolve, reject) => {
            const results = [];
            let completed = 0;
            let isDone = false;
            for (let i = 0; i < arr.length; i++) {
            setTimeout(() => {
                if(isDone) return;
                if (signal && signal.aborted) {
                    isDone = true;
                    reject("Operation cancelled");
                    return;
                }
                const value = fn(arr[i]);
                results[i] = value;
                completed++; 
                if (completed === arr.length && !isDone) {
                    isDone = true; 
                    resolve(results);                   
                }
            }, 100)
        }
    })
}

function asyncMapCallback(arr, fn, callback, signal) {
    const results = [];
    let completed = 0;
    let isDone = false;
    for (let i = 0; i < arr.length; i++) {
        setTimeout(() => {
            if(isDone) return;
            if (signal && signal.aborted) {
                isDone = true;
                callback("Operation cancelled", null);
                return;
            }
            fn(arr[i], (value) => {
                results[i] = value;
                completed++; 
                if (completed === arr.length && !isDone) {
                    isDone = true; 
                    callback(null, results);                   
                }
            });
        }, 100)
    }
}

module.exports = { asyncMap, asyncMapCallback };