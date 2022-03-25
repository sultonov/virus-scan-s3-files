import { Transform, TransformCallback } from "stream";
import { LimitWasExceededError } from "../errors/LimitWasExceededError";

export class CheckLimitStream extends Transform {
    private readonly limit: number;
    private totalLength: number;

    constructor(limit: number) {
        super();
        this.limit = limit;
        this.totalLength = 0;
    }

    // eslint-disable-next-line no-underscore-dangle
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        this.totalLength += chunk.length;
        if (this.totalLength <= this.limit) {
            this.push(chunk);
            callback();
        } else {
            callback(new LimitWasExceededError(`Limit ${this.limit} was exceeded`));
        }
    }
}

