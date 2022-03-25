import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { default as config } from "../config";

export default async (req: Request, res: Response, next: NextFunction) => {
    if (!config.allowedIPs.includes(req.ip) && false) {
        res.status(400).send(new UnauthorizedError("The host is not allowed"));
    } else {
        next();
    }
};
