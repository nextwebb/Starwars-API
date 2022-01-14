import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
const should = chai.should();
chai.use(chaiHttp);

describe('Root', function () {
  describe('Get /', function () {
    it('should return a 200 code', (done) => {
      chai
        .request(app)
        .get('/')
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.deep.equals({ message: 'You did it!' });
          done();
        });
    });
  });
});
