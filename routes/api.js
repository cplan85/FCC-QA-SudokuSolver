'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;


    if (!puzzle || !coordinate || !value ) {
      res.json({ error: 'Required field(s) missing' })
      return;
    }

    value = Number(value)

    console.log(value, "MY VALU")
    if (!isValidNumber(value)) {
      
      res.json({ error: 'Invalid value' })
      return;
    }

    if (!isValidCoordinate(coordinate)) {
      res.json({ error: 'Invalid coordinate'})
      return;
    }

      let inputCheck = solver.validate(puzzle);

      if (!inputCheck.valid) {
        res.json({ error: inputCheck.error })
        return;
      }

      let row = getRowFromCoordinate(coordinate);
      let col = parseInt(coordinate[1]) -1;
      let grid = solver.parseInput(puzzle)

      let responseObj = {valid: true}
      let conflicts = []

      //if value is already the same in the grid
      if(grid[row][col] === value) {
        res.json(responseObj)
        return;
      }
      
      let isRowOkay = solver.checkRowPlacement(grid, row, col, value );
      let isColOkay = solver.checkColPlacement(grid, row, col, value );
      let isRegionOkay = solver.checkRegionPlacement(grid, row, col, value)

      if (!isRowOkay) {
        conflicts.push("row");
      }

      if (!isColOkay) {
        conflicts.push("column");
      }

      if (!isRegionOkay) {
        conflicts.push("region");
      }

      if (conflicts.length > 0) {
        responseObj.valid = false;
        responseObj.conflict = conflicts
      }
      

     res.json(responseObj)

      

    });
    
  app.route('/api/solve')
    .post((req, res) => {

      let puzzle = req.body.puzzle;
      if(!puzzle) {
        res.json({ error: 'Required field missing' })
        return;
      }
      let inputCheck = solver.validate(puzzle);

      if (!inputCheck.valid) {
        res.json({ error: inputCheck.error })
      }

      // Function to parse the input string into a 2D array
      const result = solver.solve(puzzle);

      res.json( result )

    });
};

function isValidCoordinate(coordinate) {
  const regex = /^[A-Ia-i][1-9]$/;
  return regex.test(coordinate);
}

function isValidNumber(number) {
  const regex = /^[1-9]$/;
  return regex.test(number);
}

function getRowFromCoordinate(coordinate) {
  const rowChar = coordinate.charAt(0).toUpperCase(); // Get the first character and convert to uppercase
  const row = rowChar.charCodeAt(0) - 'A'.charCodeAt(0); // Calculate the row index
  return row;
}
