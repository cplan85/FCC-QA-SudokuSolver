const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const {puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    function generateRandomString(length, extracharacter) {
        const characters = `0123456789${extracharacter}`;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
        const randomIndex = Math.floor(Math.random() * 4);
        const randomPuzzleString = puzzlesAndSolutions[randomIndex][0];
        const randomPuzzleSolution = puzzlesAndSolutions[randomIndex][1];
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({
            "puzzle": randomPuzzleString,
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.solution, randomPuzzleSolution);
            done();
          });
      });

      test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.error, "Required field missing");
            done();
          });
      });

      test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({
            "puzzle": generateRandomString(81, "/"),
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
      });

      test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({
            "puzzle": generateRandomString(80, "."),
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
      });

      test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({
            "puzzle": generateRandomString(81, "."),
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.error, 'Puzzle cannot be solved');
            done();
          });
      });

      // let puzzle = req.body.puzzle;
      // let coordinate = req.body.coordinate;
      // let value = req.body.value;

      test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
        const firstPuzzleString = puzzlesAndSolutions[0][0];
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
            "puzzle": firstPuzzleString,
            "coordinate": "A2",
            "value": 3
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.valid, true);
            done();
          });
      });

      //ARRAY
      test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
        const firstPuzzleString = puzzlesAndSolutions[0][0];
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
            "puzzle": firstPuzzleString,
            "coordinate": "A2",
            "value": 4
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.conflict.length, 1);
            done();
          });
      });

           test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
            const firstPuzzleString = puzzlesAndSolutions[0][0];
            chai
              .request(server)
              .keepOpen()
              .post('/api/check')
              .send({
                "puzzle": firstPuzzleString,
                "coordinate": "A4",
                "value": 5
              })
              .end(function (err, res) {
                assert.equal(res.type,'application/json');
                assert.equal(res.body.conflict.length, 2);
                done();
              });
          });

          test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
            const firstPuzzleString = puzzlesAndSolutions[0][0];
            chai
              .request(server)
              .keepOpen()
              .post('/api/check')
              .send({
                "puzzle": firstPuzzleString,
                "coordinate": "A2",
                "value": 2
              })
              .end(function (err, res) {
                assert.equal(res.type,'application/json');
                assert.equal(res.body.conflict.length, 3);
                done();
              });
          });

      test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
        const firstPuzzleString = puzzlesAndSolutions[0][0];
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
            "coordinate": "A2",
            "value": 3
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.error, "Required field(s) missing");
            done();
          });
      });

      test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
            "puzzle": generateRandomString(81, "-"),
            "coordinate": "A2",
            "value": 3
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
          });
      });

      test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
        const firstPuzzleString = puzzlesAndSolutions[0][0];
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
            "puzzle": generateRandomString(79, "."),
            "coordinate": "A2",
            "value": 3
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
          });
      });

      test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
        const firstPuzzleString = puzzlesAndSolutions[0][0];
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
            "puzzle": firstPuzzleString,
            "coordinate": "A11",
            "value": 3
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.error, "Invalid coordinate");
            done();
          });
      });

      test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
        const firstPuzzleString = puzzlesAndSolutions[0][0];
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
            "puzzle": firstPuzzleString,
            "coordinate": "A11",
            "value": 11
          })
          .end(function (err, res) {
            assert.equal(res.type,'application/json');
            assert.equal(res.body.error, "Invalid value");
            done();
          });
      });

});

//{valid: false, error: 'Invalid characters in puzzle' }