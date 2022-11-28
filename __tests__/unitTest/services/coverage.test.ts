import {
	getMonthlyConversionRate,
	getDailySessions,
	convertDailyToMonthly,
	relateSessionsAndConversion,
	filterOutliers,
	restructureConversionRate,
} from '../../../src/services/conversion.js';

it('gets monthly conversion rates', async () => {
	const monthlyConversionRate = await getMonthlyConversionRate();
	const expected = [
		['2020-07-31', '0.00824499'],
		['2020-06-30', '0.00898437'],
		['2021-03-31', '0.01032566'],
	];
	expect(monthlyConversionRate[0]).toEqual(expected[0]);
	expect(monthlyConversionRate[1]).toEqual(expected[1]);
	expect(monthlyConversionRate[2]).toEqual(expected[2]);
});

it('gets daily sessions', async () => {
	const dailySessions = await getDailySessions();
	const expected = [
		['2021-03-14', '1.0'],
		['2021-07-13', '0.68'],
		['2020-06-30', '0.59'],
	];
	expect(dailySessions[0]).toEqual(expected[0]);
	expect(dailySessions[1]).toEqual(expected[1]);
	expect(dailySessions[2]).toEqual(expected[2]);
});

it('converts daily to monthly sessions', async () => {
	const dailySessions = await getDailySessions();
	const monthlySessions = convertDailyToMonthly(dailySessions);
	const expected = [
		['2021-03-31', 4.169999999999999],
		['2021-07-31', 3.4799999999999973],
		['2020-06-30', 4.229999999999999],
	];
	expect(monthlySessions[0]).toEqual(expected[0]);
	expect(monthlySessions[1]).toEqual(expected[1]);
	expect(monthlySessions[2]).toEqual(expected[2]);
});

it('relates sessions and conversion rates', async () => {
	const monthlyConversionRate = await getMonthlyConversionRate();
	const dailySessions = await getDailySessions();
	const monthlySessions = convertDailyToMonthly(dailySessions);
	const relation = relateSessionsAndConversion(
		monthlyConversionRate,
		monthlySessions,
	);
	const expected = [
		['2021-03-31', 0.00197721582733813],
		['2021-07-31', 0.0025817155172413813],
		['2020-06-30', 0.0024410543735224597],
	];
	expect(relation[0]).toEqual(expected[0]);
	expect(relation[1]).toEqual(expected[1]);
	expect(relation[2]).toEqual(expected[2]);
});

it('filters outliers', async () => {
	const relation = [
		['2021-03-31', 0.00197721582733813],
		['2021-07-31', 0.0025817155172413813],
		['2020-06-30', 0.0024410543735224597],
		['2022-04-30', 0.004059274760383389],
		['2021-01-31', 0.004329044067796613],
		['2022-05-31', 0.009063631578947365],
		['2020-11-30', 0.003616041025641026],
		['2021-04-30', 0.008660365269461073],
		['2020-09-30', 0.0061623146067415775],
		['2020-10-31', 0.004643245070422536],
		['2020-07-31', 0.012671735714285712],
		['2021-09-30', 0.01120448214285714],
		['2022-03-31', 0.013957306666666659],
		['2020-08-31', 0.009005322957198443],
		['2020-05-31', 0.028102033333333325],
		['2020-12-31', 0.012359918918918928],
		['2021-11-30', 0.020535714285714275],
		['2021-05-31', 0.027596641509433955],
		['2022-02-28', 0.0209225608108108],
		['2021-02-28', 0.024092717557251894],
		['2021-10-31', 0.018810072625698313],
		['2021-12-31', 0.031546981308411194],
		['2021-08-31', 0.02133135220125785],
		['2022-01-31', 0.042561237113402046],
		['2021-06-30', 0.08331265671641785],
	];
	const outliers = filterOutliers(relation);
	const expected = ['2021-06-30'];
	expect(outliers).toEqual(expected);
});

it('restructures conversion rates', async () => {
	const monthlyConversionRate = [
		[ '2020-10-31', '0.01774043' ],
        [ '2021-06-30', '0.01882353' ],
        [ '2020-09-30', '0.02093596' ],
	];
	const outliers = ['2021-06-30'];
	const conversionRate = restructureConversionRate(
		monthlyConversionRate,
		outliers,
	);
	const expected = [
		{ date: '2020-10-31', conversionRate: 0.01774043, isOutlier: false },
		{ date: '2021-06-30', conversionRate: 0.01882353, isOutlier: true },
		{ date: '2020-09-30', conversionRate: 0.02093596, isOutlier: false },
	];
	expect(conversionRate).toEqual(expected);
});
