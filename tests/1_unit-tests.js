const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const {puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('Unit Tests', () => {

    function generateRandomString(length, extracharacter) {
        const characters = `0123456789${extracharacter}`;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

      // #1
  test("Logic handles a valid puzzle string of 81 characters", function () {
    const randomIndex = Math.floor(Math.random() * 4);
    let randomCorrectPuzzle = puzzlesAndSolutions[randomIndex][0];
    let validaterLogic = solver.validate(randomCorrectPuzzle)
    assert.equal(validaterLogic.valid, true);
  });
    // #2
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {

    
    const randomString = generateRandomString(81, "-");

    let validaterLogic = solver.validate(randomString)
    assert.equal(validaterLogic.valid, false);
    assert.equal(validaterLogic.error, 'Invalid characters in puzzle');
  });

      // #3
      test("Logic handles a puzzle string that is not 81 characters in length", function () {
        
        const randomString = generateRandomString(75, ".");
    
        let validaterLogic = solver.validate(randomString)
        assert.equal(validaterLogic.valid, false);
        assert.equal(validaterLogic.error, 'Expected puzzle to be 81 characters long');
      });

        // #4
        test("Logic handles a valid row placement", function () {
        
            let firstCorrectPuzzle = puzzlesAndSolutions[0][0];
            let grid = solver.parseInput(firstCorrectPuzzle);
            //check if the  the first row, at column 1 with value of 6
            const firstRowCheck = solver.checkRowPlacement(grid, 0, 1, 6)

            assert.equal(firstRowCheck, true);
          });

          // #5

          test("Logic handles an invalid row placement", function () {
        
            let firstCorrectPuzzle = puzzlesAndSolutions[0][0];

            let grid = solver.parseInput(firstCorrectPuzzle);

            //check if the  the first row, at column 1 with value of 6
            const firstRowCheck = solver.checkRowPlacement(grid, 0, 1, 1)

            assert.equal(firstRowCheck, false);
          });

         // #6
         test("Logic handles a valid column placement", function () {
        
            let firstCorrectPuzzle = puzzlesAndSolutions[0][0];
            let grid = solver.parseInput(firstCorrectPuzzle);
            //check if the  the first row, at column 1 with value of 6
            const firstColCheck = solver.checkColPlacement(grid, 0, 1, 3)

            assert.equal(firstColCheck, true);
          });

            // #7
         test("Logic handles an invalid column placement", function () {
        
            let firstCorrectPuzzle = puzzlesAndSolutions[0][0];
            let grid = solver.parseInput(firstCorrectPuzzle);

            //check if the  the first row, at column 1 with value of 6
            const firstColCheck = solver.checkColPlacement(grid, 0, 1, 7)

            assert.equal(firstColCheck, false);
          });


          test("Logic handles a valid region (3x3 grid) placement", function () {
        
            let firstCorrectPuzzle = puzzlesAndSolutions[0][0];
            let grid = solver.parseInput(firstCorrectPuzzle);

            const possibleRightValues=[3,4,7,8,9]
            const possibleWrongValues=[1,5,6,2];

            const randomIndex = Math.floor(Math.random() * 4);
            //check if the  the first row, at column 1 with value of 6
            const firstRegionCheck = solver.checkRegionPlacement(grid, 0, 1, possibleRightValues[randomIndex])

            assert.equal(firstRegionCheck, true);
          });

          test("Logic handles an invalid region (3x3 grid) placement", function () {
        
            let firstCorrectPuzzle = puzzlesAndSolutions[0][0];
            let grid = solver.parseInput(firstCorrectPuzzle);

            const possibleWrongValues=[1,5,6,2];

            const randomIndex = Math.floor(Math.random() * 3);
            //check if the  the first row, at column 1 with value of 6
            const firstRegionCheck = solver.checkRegionPlacement(grid, 0, 1, possibleWrongValues[randomIndex])

            assert.equal(firstRegionCheck, false);
          });

          test("Valid puzzle strings pass the solver", function () {

            const randomIndex = Math.floor(Math.random() * 4);
            let randomValidPuzzleString = puzzlesAndSolutions[randomIndex][0];

            let solverResult = solver.solve(randomValidPuzzleString);

            assert.property(solverResult, 'solution', 'The result has a solution');
            //assert.equal(firstRegionCheck, false);
          });

          test("Invalid puzzle strings fail the solver", function () {

            const randomString = generateRandomString(81, ".");

            let solverResult = solver.solve(randomString);

            assert.property(solverResult, 'error', 'Puzzle cannot be solved');
            //assert.equal(firstRegionCheck, false);
          });

          test("Solver returns the expected solution for an incomplete puzzle", function () {

            const randomIndex = Math.floor(Math.random() * 4);
            const randomPuzzleString = puzzlesAndSolutions[randomIndex][0];
            const randomPuzzleSolution = puzzlesAndSolutions[randomIndex][1];

            let solverResult = solver.solve(randomPuzzleString);

            assert.equal(solverResult.solution, randomPuzzleSolution);
            //assert.equal(firstRegionCheck, false);
          });

          

});
