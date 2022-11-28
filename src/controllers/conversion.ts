import { RequestHandler, Request, Response } from 'express';
import { check } from 'express-validator';
import validate from '../middleware/validator.js';
import {
	getMonthlyConversionRate,
	getDailySessions,
	convertDailyToMonthly,
	relateSessionsAndConversion,
	filterOutliers,
	restructureConversionRate,
} from '../services/conversion.js';

export default class Conversion {
	public get rate(): RequestHandler[] {
		return [
			check('id').isNumeric().isInt({ min: 1 }).optional(),
			validate,
			async (req: Request, res: Response): Response => {
				const {
					query: { id },
				} = req;

				console.log('id = ', id);

				const monthlyConversionRate = await getMonthlyConversionRate();
				const dailySessions = await getDailySessions();
				const monthlySessions = convertDailyToMonthly(dailySessions);
				const relation = relateSessionsAndConversion(
					monthlyConversionRate,
					monthlySessions,
				);
				const outliers = filterOutliers(relation);
				const conversionRate = restructureConversionRate(
					monthlyConversionRate,
					outliers,
				);

				return res.status(200).json(conversionRate);
			},
		];
	}
}
