export class UnauthorizedError extends Error {
    constructor(message?: string) {
        super(message);

        Error.captureStackTrace(this, UnauthorizedError);
    }
}
