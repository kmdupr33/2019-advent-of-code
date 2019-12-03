const fs = require('fs');
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./1-1-input.txt'),
});

let fuel = 0;

readInterface.on('line', (line) => {
  fuel += Math.floor(parseInt(line, 10) / 3) - 2;
});
readInterface.on('close', () => {
  // eslint-disable-next-line no-console
  console.log(fuel);
});
