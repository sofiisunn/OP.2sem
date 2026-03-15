'use strict';

const lib = require('lab2-op');

const gen1 = lib.generator();
console.log("Generator:");
console.log(gen1.next().value);
console.log(gen1.next().value);
console.log(gen1.next().value);

console.log("Iterator:");
const gen2 = lib.generator();
const timeInSeconds = 10;
const time = timeInSeconds * 1000;

lib.iterator(gen2, time);