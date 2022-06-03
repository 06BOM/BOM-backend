//test.js
// npm run test를 이용해서 unit test 실행
import app from "../src/app";
import should from 'should';
import request from 'supertest';

let auth = {};

describe('plan controller test', () => {
	before(loginUser());

	describe('createPlan func test', () => {
    it('should return ~', () => {
      //테스트 코드
    });
    it('should return ~', () => {
      //테스트 코드
    })    
  });
 
  describe('GET /plan/star test', () => {
	it('should return success json', (done) => {
		request(app)
			.get('/plan/star')
			.query({ date: "2022-05-18"})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('star');
				should(res._body).have.property('star', 3);
			})
			.end(done);
	});
  })

  describe('GET /plan/week/star test', () => {
	it('should return success json', (done) => {
		request(app)
			.get('/plan/week/star')
			.query({ date: "2022-05-18"})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('stars');
				should(res._body).have.property('stars', 3);
			})
			.end(done);
	});
  })

  describe('GET /plan/all test', () => {
	it('should return success json', (done) => {
		request(app)
			.get('/plan/all')
			.query({ date: "2022-05-18"})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('result');
				should(res._body.result).be.an.instanceOf(Array);
			})
			.end(done);
	});
  })

  describe('GET /plan/month/star test', () => {
	it('should return success json', (done) => {
		request(app)
			.get('/plan/month/star')
			.query({ date: "2022-05-18"})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('stars');
				should(res._body).have.property('stars', 3);
			})
			.end(done);
	});
  })
});

function loginUser() {
	return function(done) {
		request(app)
		.post('/auth/login')
		.send({
			platform: 'local',
            emailId: 'test@bombomtest.com',
            password: 'Qlalfqjsgh06@'
		})
		.expect(res => {
			should(res).have.property('statusCode', 200);
		}).end(onResponse);

        function onResponse(err, res) {
            // @ts-ignore
			auth.token = res._body.payload.accessToken;
			return done();
        }
    }
}