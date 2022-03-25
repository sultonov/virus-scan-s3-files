import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as stream from "stream";
import * as util from "util";
import { CheckLimitStream } from "../helpers/CheckLimitStream";
import { S3 } from "aws-sdk";
import { default as config } from "../config";
import os from "os";
import path from "path";

export class S3Service {
    private readonly s3: S3;

    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretKey,
            region: config.aws.region,
        });
    }


    public async isValidS3BucketAndKey(bucket: string, key: string) {
        const params = {
            Bucket: bucket,
            Key: key
        };

        try {
            await this.s3.headObject(params).promise();

            return true;
        } catch (error) {
            return false;
        }
    }

    public async downloadFileToTempFolder(bucket: string, key: string){
        const params = {
            Bucket: bucket,
            Key: key
        };
        const filePath = `${os.tmpdir()}/${(Math.random() + 1).toString(36)}${path.basename(key)}`;

        try {
            console.log(`Started to read input file ${key}`);
            const readable = this.s3.getObject(params).createReadStream();
            let readDataSize = 0;
            readable.on("data", (chunk) => {
                readDataSize += chunk.length;
            });

            const writable = fs.createWriteStream(filePath);

            const pipeline = util.promisify(stream.pipeline);
            await pipeline(
                readable,
                new CheckLimitStream(config.maxInputBytes),
                writable,
            );

            console.log(`File created in FS: ${filePath} size ${readDataSize}`);
        } catch (err) {
            console.error(err);
            throw err;
        }

        return filePath;
    }
}
