const fs = require('fs');
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream(process.argv[2]),
});

const parseMove = move => ({
	type: move[0],
	units: parseInt(move.substring(1))
});

const findVerticalIntersection = (move, wire1VerticalMoves) => {
	for (let wire1Move of wire1VerticalMoves) {
		const {column: wire1Column, row: startRow} = wire1Move.start;	
		const {row: endRow} = wire1Move.end;
		const {column: startCol, row: wire2Row} = move.start;
		const {column: endCol} = move.end;
		const firstCol = Math.min(startCol, endCol);
		const secondCol = Math.max(startCol, endCol);
		const firstRow = Math.min(startRow, endRow);
		const secondRow = Math.max(startRow, endRow);
		if (wire1Column >= firstCol && wire1Column <= secondCol) {
			if (wire2Row >= firstRow && wire2Row <= secondRow) {
				return {column: wire1Column, row: wire2Row};	
			}	
		}
	}	
	return null;
}
const findHorizontalIntersection = (move, wire1HorizontalMoves) => {
	for (let wire1Move of wire1HorizontalMoves) {
		const {column: startCol, row: wire1Row} = wire1Move.start;	
		const {column: endCol} = wire1Move.end;
		const {row: startRow, column: wire2Col} = move.start;
		const {row: endRow} = move.end;
		const firstRow = Math.min(startRow, endRow);
		const secondRow = Math.max(startRow, endRow);
		const firstCol = Math.min(startCol, endCol);
		const secondCol = Math.max(startCol, endCol);
		if (wire1Row >= firstRow && wire1Row <= secondRow) {
			if (wire2Col >= firstCol && wire2Col <= secondCol) {
				return {row: wire1Row, column: wire2Col};	
			}	
		}
	}	
	return null;
}
const wires = [];
readInterface.on('line', line => wires.push(line.split(",")));
readInterface.on('close', () => {
	const wire1VerticalMoves = [];
	const wire1HorizontalMoves = [];
	const [firstWireMoves, secondWireMoves] = wires;
	const coordinates = {row: 0, column: 0};
	console.log(firstWireMoves);
	for (let move of firstWireMoves) {
		const {type, units} = parseMove(move);
		const {row, column} = coordinates;
		const makeNewHPosition = newColumn => {
			return {start: {row, column}, end: {row, column: newColumn} };
		}
		const makeNewVPosition = newRow => {
			return {start: {row, column}, end: {row: newRow, column} };
		}
		switch(type) {
			case 'R':
				wire1HorizontalMoves.push(makeNewHPosition(column + units));
				coordinates.column += units;
				break;
			case 'L':
				wire1HorizontalMoves.push(makeNewHPosition(column - units));
				coordinates.column -= units;
				break;
			case 'U':
				wire1VerticalMoves.push(makeNewVPosition(row + units));
				coordinates.row += units;
				break;
			case 'D':
				wire1VerticalMoves.push(makeNewVPosition(row - units));
				coordinates.row -= units;
				break;
		}
		console.log(coordinates);
	}
	const intersections = [];
	const secondWireCoordinates = {row: 0, column: 0};
	for (let stringMove of secondWireMoves) {
		const {type, units} = parseMove(stringMove);	
		const {row, column} = secondWireCoordinates;
		const makeNewHPosition = newColumn => {
			return {start: {row, column}, end: {row, column: newColumn} };
		}
		const makeNewVPosition = newRow => {
			return {start: {row, column}, end: {row: newRow, column} };
		}
	
		let intersection = null;
		switch(type) {
			case 'R':
				intersection = findVerticalIntersection(makeNewHPosition(column + units), wire1VerticalMoves);
				secondWireCoordinates.column += units;
				break;
			case 'L':
				intersection = findVerticalIntersection(makeNewHPosition(column - units), wire1VerticalMoves);
				secondWireCoordinates.column -= units;
				break;
			case 'U':
				intersection = findHorizontalIntersection(makeNewVPosition(row + units), wire1HorizontalMoves);
				secondWireCoordinates.row += units;
				break;
			case 'D':
				intersection = findHorizontalIntersection(makeNewVPosition(row - units), wire1HorizontalMoves);
				secondWireCoordinates.row -= units;
			break;
		}
		if (intersection !== null) { intersections.push(intersection); } 
		console.log(secondWireCoordinates);
	}
	if (intersections.length === 0) { throw Error("no intersections"); }
	let closest = Infinity;
	console.log(JSON.stringify(intersections, null, 2));
	for (let intersection of intersections) {
		const {row, column} = intersection;
		const distance = Math.abs(row) + Math.abs(column);
		if (distance < closest) {
			closest = distance;	
		}
	}
	console.log(closest);
});
