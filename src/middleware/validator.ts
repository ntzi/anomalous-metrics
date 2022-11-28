import { Request, RequestHandler, Response, NextFunction } from 'express';
import {validationResult} from "express-validator";

const validate: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid payload',
            code: 'validation/req-payload-validation-failed',
            errors: errors.array()
        });
    }

    next();
};

export default validate;
