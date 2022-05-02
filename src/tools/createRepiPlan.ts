
const dateMover = (year: number, month: number, day: number, ...days: number[]) => {
	let currentDay = new Date();

	//let currentYear = currentDay.getFullYear();
	//let currentMonth = currentDay.getMonth() + 1;
	//let currentDate = currentDay.getDate();

	// 일요일 = 0, 월요일 = 1, 화요일 = 2, 수요일 = 3
	while (1) {
		currentDay.setDate(currentDay.getDate() + 1);
		for (let i = 0; i < days.length; i++) {
			if (currentDay.getDay() === days[i])
			{
				
			}
		}
	}
}

// year => 년 단위 기간, month => 월간 단위 기간, day => 일 단위 기간, days => 요일
export function createRepiPlan(year: number, month: number, day: number, ...days: number[]) { 
	if (year === 0 && month === 0 && day === 0) { // default
		dateMover(0,0,0,1);
	}	
}