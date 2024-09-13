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

});

//{valid: false, error: 'Invalid characters in puzzle' }