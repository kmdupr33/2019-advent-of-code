const fs = require('fs');
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./1-1-input.txt'),
});

const calculateFuelFor = (mass) => Math.floor(mass / 3) - 2;

const addFuelForFuel = (fuel) => {
  const fuelNeededForFuel = calculateFuelFor(fuel);
  if (fuelNeededForFuel <= 0) return 0;
  return fuelNeededForFuel + addFuelForFuel(fuelNeededForFuel);
};

let fuel = 0;

readInterface.on('line', (line) => {
  const fuelForModule = calculateFuelFor(parseInt(line, 10));
  fuel += fuelForModule + addFuelForFuel(fuelForModule);
});

readInterface.on('close', () => {
  // eslint-disable-next-line no-console
  console.log(fuel);
});
