//test.js
// npm run test를 이용해서 unit test 실행
import app from "../src/app";
import should from 'should';
import request from 'supertest';

let auth = {};

describe('plan controller test', () => {

	before(loginUser());

	//creatPlan, delete test는 주석처리하고 test 실행
	//test 하고싶으면 새로 생긴 plan은 지워주고 delete는 존재하는 planId 넣어서 하세용 
	describe('createPlan API test', () => {
		it('should return success json', (done) => {
			request(app)
			.post('/plan')
			.send({
				date: "2022-06-05",
				planName: "createPlan test",
				categoryId: 1
			})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('resultPlan');
				should(res._body.resultPlan).have.property('planName',"createPlan test");
			})
			.end(done);
		});   
  	});

	
	describe('deletePlan API test', () => {
		it('should return success json', (done) => {
			request(app)
			.delete('/plan/379')
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
			})
			.end(done);
		});   
  	});

	describe('getDailyStudyTime API test', () => {
		it('should return success json', (done) => {
			request(app)
			.get('/plan/total')
			.query({ date: "2022-06-05"})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('totalTime');
				should(res._body).have.property('totalTime', 200);
			})
			.end(done);
		});   
  	});

	describe('getWeeklyAverageStudyTime API test', () => {
		it('should return success json', (done) => {
			request(app)
			.get('/plan/week/average')
			.query({ date: "2022-06-02"})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('averageTime');
				should(res._body).have.property('averageTime', 57);
			})
			.end(done);
		});   
  	});

	describe('getMonthlyAverageStudyTime API test', () => {
		it('should return success json', (done) => {
			request(app)
			.get('/plan/month/average')
			.query({ date: "2022-06-02"})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('averageTime');
				should(res._body).have.property('averageTime', 13);
			})
			.end(done);
		});   
  	});

	describe('getPlanTime API test', () => {
		it('should return success json', (done) => {
			request(app)
			.get('/plan/373/time')
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('time');
				should(res._body).have.property('time', 100);
			})
			.end(done);
		});   
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

  describe('POST /plan/star test', () => {
	it('should return success json', (done) => {
		request(app)
			.post('/plan/star')
			.send({
				dailyId: 33
			})
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
			})
			.end(done);
	});
  })

  describe('GET /plan/month/all/star test', () => {
	it('should return success json', (done) => {
		request(app)
			.get('/plan/month/all/star')
			.query({ date: "2022-05-18" })
			// @ts-ignore
			.auth(auth.token, { type: 'bearer' })
			.expect(res => {
				should(res).have.property('statusCode', 200);
				should(res._body).have.property('opcode', 0);
				should(res._body).have.property('allMonthlyStars');
				should(res._body.allMonthlyStars).be.an.instanceOf(Array);
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