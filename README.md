# OP Project
## Description 
This task demonstrates the use of a generator and an iterator to generate tasks with different colors
## Project structure
src/ - source code;
example/ - example of using;
package.json - project configuration;
README.md - project documentation
## Usage
Run the example program in the terminal:

```bash
node example/example.js
Example of using generator only:

const lib = require('../src');

const gen1 = lib.generator();
console.log("Generator:");
console.log(gen1.next().value);
console.log(gen1.next().value);
console.log(gen1.next().value);

Example of using iterator:

console.log("Iterator:");
const gen2 = lib.generator();
const timeInSeconds = 10;
const time = timeInSeconds * 1000;

lib.iterator(gen2, time);
```

## Author
Sofiia Openko 
