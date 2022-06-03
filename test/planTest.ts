//test.js
// npm run test를 이용해서 unit test 실행
import app from "../src/app";
import should from 'should';
import request from 'supertest';

let auth = {};

describe('plan controller test', () => {
	before(loginUser(auth));

	describe('createPlan func test', () => {
    it('should return ~', () => {
      //테스트 코드
    });
    it('should return ~', () => {
      //테스트 코드
    })    
  });

  describe('pr', () => {
	it('should return success json', (done) => {
		request(app)
			.get('/')
			.expect(res => {
				should(res).have.property('statusCode', 200);
			}).end(done);
	});
  })

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
		}).end(done);
            /*.send({
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
        }*/
    }
}