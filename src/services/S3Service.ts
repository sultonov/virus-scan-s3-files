import { default as config } from "../config";
import * as AWS from "aws-sdk";
import {S3} from "aws-sdk";
import * as fs from "fs";
import path from "path";
import os from "os";

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
        } catch (error: any) {
            return false;
        }
    }

    public async downloadFileToTempFolder(bucket: string, key: string){
        const params = {
            Bucket: bucket,
            Key: key
        };
        const filePath = `${os.tmpdir()}/${path.basename(key)}`;

        await this.s3.getObject(params, (err, data) => {
            if (data.Body){
                fs.writeFileSync(filePath, data.Body.toString());
                console.log(`${filePath} has been created!`);
            }
            else {
                console.error(err);
            }
        }).promise();

        return filePath;
    }
}
