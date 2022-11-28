import supertest from 'supertest';
import app from '../../../src/app.js';
const request = supertest(app);

it('test GET api/conversion-rate', async () => {
	const expected = [
		{ date: '2020-07-31', conversionRate: 0.00824499, isOutlier: false },
		{ date: '2020-06-30', conversionRate: 0.00898437, isOutlier: false },
		{ date: '2021-03-31', conversionRate: 0.01032566, isOutlier: false },
		{ date: '2020-12-31', conversionRate: 0.01270553, isOutlier: false },
		{ date: '2021-01-31', conversionRate: 0.01277068, isOutlier: false },
		{ date: '2021-07-31', conversionRate: 0.01377672, isOutlier: false },
		{ date: '2020-08-31', conversionRate: 0.01410256, isOutlier: false },
		{ date: '2021-08-31', conversionRate: 0.01446281, isOutlier: false },
		{ date: '2020-05-31', conversionRate: 0.01645338, isOutlier: false },
		{ date: '2020-11-30', conversionRate: 0.01648352, isOutlier: false },
		{ date: '2020-10-31', conversionRate: 0.01774043, isOutlier: false },
		{ date: '2021-06-30', conversionRate: 0.01882353, isOutlier: true },
		{ date: '2020-09-30', conversionRate: 0.02093596, isOutlier: false },
		{ date: '2021-04-30', conversionRate: 0.02314368, isOutlier: false },
		{ date: '2021-09-30', conversionRate: 0.02529183, isOutlier: false },
		{ date: '2021-05-31', conversionRate: 0.02743902, isOutlier: false },
		{ date: '2021-02-28', conversionRate: 0.02875, isOutlier: false },
		{ date: '2022-05-31', conversionRate: 0.02925244, isOutlier: false },
		{ date: '2021-10-31', conversionRate: 0.03096539, isOutlier: false },
		{ date: '2022-01-31', conversionRate: 0.03156146, isOutlier: false },
		{ date: '2022-02-28', conversionRate: 0.03367003, isOutlier: false },
		{ date: '2022-04-30', conversionRate: 0.03375527, isOutlier: false },
		{ date: '2022-03-31', conversionRate: 0.03391685, isOutlier: false },
		{ date: '2021-12-31', conversionRate: 0.0412844, isOutlier: false },
		{ date: '2021-11-30', conversionRate: 0.05581948, isOutlier: false },
	];
	const response = await request.get('/api/conversion-rate');
	expect(response.status).toBe(200);
	expect(response.body).toStrictEqual(expected);
});
