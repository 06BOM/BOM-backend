//test.js
// npm run test를 이용해서 unit test 실행
import app from "../src/app";
import should from 'should';
import request from 'supertest';

describe('plan controller test', () => {
	let auth = {};
	before(loginUser(auth));

	describe('createPlan func test', () => {
    it('should return ~', () => {
      //테스트 코드
    });
    it('should return ~', () => {
      //테스트 코드
    })    
  });
  /* 
  describe('getDailyStar func test', () => {
	it('should return success json', (done) => {
		request(app)
			.get('/plan/star')
			// @ts-ignore
			.set('Authorization', 'bearer ' + auth.token)
			.expect(200)
			.end((err, res) => {
				if (err) throw err;
				done();
			});	
	});
  })*/
});

function loginUser(auth) {
    return function() {
		console.log("before hook");
	}
	/*return function(done) {
        request
            .post('/auth/login')
            .send({
				platform: 'local',
                email: 'test@bombomtest.com',
                password: 'Qlalfqjsgh06@'
            })
            //.end(onResponse);

			done();

        function onResponse(err, res) {
			//console.log(res);
            //auth.token = res.body.accessToken;
            return done();
        }
    };*/
}