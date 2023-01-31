import {NextFunction, Request, Response} from "express";
import {ErrorCodes} from '../constants/const';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    const errorRes = {
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack
        }
    };

    switch (err.name) {
        case 'ValidationError':
            res.status(ErrorCodes.BadRequest).json(errorRes);
            break;
        case 'UniqueViolationError':
            res.status(ErrorCodes.BadRequest).json(errorRes);
            break;
        case 'NotAuthorisedError':
            res.status(ErrorCodes.Forbidden).json(errorRes);
            break;
        case 'NotAuthenticatedError':
        case 'UnauthorizedError':
            res.status(ErrorCodes.Unauthorised).json(errorRes);
            break;
        case 'NotFoundError':
        case 'RowNotFound':
            res.status(ErrorCodes.NotFound).json(errorRes);
            break;
        case 'ResourceConflictError':
            res.status(ErrorCodes.Conflict).json(errorRes);
            break;
        default:
            if (process.env.NODE_ENV !== 'production') {
                errorRes.error.stack = err.stack;
            }
            res.status(ErrorCodes.InternalError).json(errorRes);
            next();
    }
};
