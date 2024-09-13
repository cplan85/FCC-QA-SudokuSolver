class SudokuSolver {


  validate(puzzleString) {
    const isValid = /^[0-9.]+$/.test(puzzleString);
    if(!isValid) {
      return {valid: false, error: 'Invalid characters in puzzle' }
    }
    else if (puzzleString.length != 81) {
      return {valid: false, error: 'Expected puzzle to be 81 characters long' }
    }
    else return {valid: true}
  }

  parseInput(puzzleString) {
    const grid = [];
    for (let i = 0; i < 9; i++) {
      const row = puzzleString.slice(i * 9, (i + 1) * 9).split('').map(char => (char === '.' ? 0 : parseInt(char)));
      grid.push(row);
    }
    return grid;
  }

  checkRowPlacement(grid, row, column, value) {
    for (let column = 0; column < 9; column++) {
      if (grid[row][column] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(grid, row, column, value) {
    for (let row = 0; row < 9; row++) {
      if (grid[row][column] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(grid, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === value) {
          return false;
        }
      }
    }
    return true;

  }

  solve(puzzleString) {
    
    let grid = this.parseInput(puzzleString);

    const isSolvable = (grid, row, col, value) => {
      return this.checkRowPlacement(grid, row, col, value) &&
             this.checkColPlacement(grid, row, col, value) &&
             this.checkRegionPlacement(grid, row, col, value);
    };

    // Backtracking solver function
const solveSudoku = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSolvable(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const gridToString = (grid) => {
  return grid.flat().join('');
};

if (solveSudoku(grid)) {
  const solvedString = gridToString(grid);
  return {solution: solvedString}
} else {
  return {error: 'Puzzle cannot be solved'}
} 
  }
}





module.exports = SudokuSolver;

