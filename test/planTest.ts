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
 
  describe('getDailyStar func test', () => {
	it('should return success json', (done) => {
		request(app)
			.get('/plan/star')
			.query({ date: "2022-05-18"})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				console.log(res);
				//should(res).have.property('statusCode', 200);
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