import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import moment from 'moment';

interface conversionRatesInterface {
	date: string,
	conversionRate: number,
	isOutlier: boolean
}

const getMonthlyConversionRate = async (): Promise<string[][]> => {
	const csvPath = 'data/monthly_conversion_rate.csv';
	const fullPath = path.join(process.cwd(), csvPath);
	return await parseCsv(fullPath);
};

const getDailySessions = async (): Promise<string[][]> => {
	const csvPath = 'data/relative_daily_num_sessions.csv';
	const fullPath = path.join(process.cwd(), csvPath);
	return await parseCsv(fullPath);
};

const parseCsv = async (path: string): Promise<string[][]> => {
	const result = [];
	const parser = fs.createReadStream(path).pipe(parse());

	for await (const record of parser) {
		if (record[0] === 'date') continue;
		result.push(record);
	}
	return result;
};

const convertDailyToMonthly = (dailySessions: string[][]): number[][] => {
	/*
		Summarize all days of each month and normalize to 1
	*/

	const monthlySessions = {};

	dailySessions.map((record) => {
		const date = record[0];
		const sessions = Number(record[1]);
		// Get the last day of the month
		const newDate = moment(date).endOf('month').format('YYYY-MM-DD');

		if (monthlySessions[newDate]) {
			monthlySessions[newDate] += sessions;
		} else {
			monthlySessions[newDate] = sessions;
		}
	});

	const monthlySessionsArray = [];
	Object.keys(monthlySessions).map((date) => {
		monthlySessionsArray.push([date, monthlySessions[date]]);
	});

	return monthlySessionsArray;
};

const relateSessionsAndConversion = (
	conversionRates: string[][],
	sessions: number[][],
): number[][] => {
	const relation = [];
	sessions.map((session, i) => {
		const date = session[0];
		const totalSessions = session[1];
		const conversionRate = Number(conversionRates[i][1]);
		relation.push([date, conversionRate / totalSessions]);
	});

	return relation;
};

const filterOutliers = (sessions): string[] => {
	/*
		Filter outliers
		High outliers are anything beyond the 3rd quartile + 1.5 * the inter-quartile range (IQR)
		Low outliers are anything beneath the 1st quartile - 1.5 * IQR
	*/

	let values = sessions.map((session) => session[1]);
	let q1, q3

	// values = someArray.slice().sort((a, b) => a - b); //copy array fast and sort
	values = values.sort((a: number, b: number) => a - b);

	if ((values.length / 4) % 1 === 0) {
		//find quartiles
		q1 =
			(1 / 2) *
			(values[values.length / 4] + values[values.length / 4 + 1]);
		q3 =
			(1 / 2) *
			(values[values.length * (3 / 4)] +
				values[values.length * (3 / 4) + 1]);
	} else {
		q1 = values[Math.floor(values.length / 4 + 1)];
		q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
	}

	const iqr = q3 - q1;
	const maxValue = q3 + iqr * 1.5;
	const minValue = q1 - iqr * 1.5;

	// These are the outliers
	const filteredValues = values.filter((x) => x <= minValue || x >= maxValue);
	const filteredDates = getDatesFromValues(sessions, filteredValues)

	return filteredDates
};

const getDatesFromValues = (sessions, values) => {
	const dates = []
	sessions.map(session => {
		const date = session[0]
		const numberOfSessions = session[1]
		if (values.includes(numberOfSessions)) dates.push(date)
	})
	return dates
}

const restructureConversionRate = (conversionRates: string[][], outliers: string[]): conversionRatesInterface[] => {
	const restructuredRates: conversionRatesInterface[] = []

	conversionRates.map(item => {
		const date = item[0]
		const conversionRate = Number(item[1])
		restructuredRates.push({
			date,
			conversionRate,
			isOutlier: outliers.includes(date) ? true : false
		})
	})

	return restructuredRates
}

export {
	getMonthlyConversionRate,
	getDailySessions,
	convertDailyToMonthly,
	relateSessionsAndConversion,
	filterOutliers,
	restructureConversionRate
}
