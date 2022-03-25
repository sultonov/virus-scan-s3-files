import * as child from "child_process";
import { Request, Response, Router } from "express";
import { S3Service } from "./services/S3Service";
import { default as config } from "./config";
import { default as hostFilter } from "./middlewares/hostFilter";

const router = Router();

router.all("*", hostFilter, async (req: Request, res: Response) => {
    const { bucket, key } = req.body;
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
        child.execSync(execString, { stdio: "inherit" });
        console.log(`Command ${execString} executed successfully`);

        res.status(200).send({
            status: config.statuses.clean,
            code: 0,
        });
    } catch (err) {
        console.log("ClamAV file check error: ", err);
        // Error status 1 means that the file is infected.
        if (err.status === 1) {
            res.status(200).send({
                status: config.statuses.infected,
                code: 0
            });
        } else {
            res.status(200).send({
                status: config.statuses.error,
                message: (err as child.ExecException).toString(),
                code: 0
            });
        }
    }
});

export default router;
