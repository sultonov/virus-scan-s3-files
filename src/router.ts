import {Request, Response, Router} from "express";
import {default as config} from "./config";
import {default as hostFilter} from "./middlewares/hostFilter";
import * as child from 'child_process';
import * as AWS from 'aws-sdk';
import {S3Service} from "./services/S3Service";

const router = Router();

router.all("*", hostFilter, async (req: Request, res: Response) => {
    const {bucket, key} = req.body;
    console.log(bucket, key);
    const service = new S3Service();

    try {
        // check bucket and path to file is correct
        if (!bucket || !key || !(await service.isValidS3BucketAndKey(bucket, key))) {
            res.status(200).send({
                status: config.statuses.error,
                message: "Wrong parameters provided",
                code: 0
            });

            return;
        }

        // download file to temp folder
        const filePath = await service.downloadFileToTempFolder(bucket, key);

        const execString = `${config.clamAVPath} -v --stdout ${filePath}`;
        console.log(`Executing command ${execString}`);
        await child.exec(execString);
        console.log(`Command ${execString} executed successfully`);

        res.status(200).send({
            status: config.statuses.clean,
            code: 0,
        });
    } catch (err: any) {
        console.log('ClamAV file check error: ', err);
        // Error status 1 means that the file is infected.
        if (err.status === 1) {
            res.status(200).send({
                status: config.statuses.infected,
                code: 0
            });
        } else {
            res.status(200).send({
                status: config.statuses.error,
                message: err.toString(),
                code: 0
            });
        }
    }
});

export default router;
