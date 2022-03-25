import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { default as config } from "../config";

export default async (req: Request, res: Response, next: NextFunction) => {
    const requestIp = req.headers["x-forwarded-for"] as string || req.connection.remoteAddress as string;

    if (!config.allowedIPs.includes(requestIp)) {
        console.log(`IP address ${req.ip} is not allowed to scan files`);
        res.status(400).send(new UnauthorizedError("The host is not allowed"));
    } else {
        next();
    }
};
