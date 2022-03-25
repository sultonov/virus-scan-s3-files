export default {
    app: {
        version: process.env.APP_VERSION || "1.0.0",
        port: Number(process.env.APP_PORT || 3100),
        timeout: Number(process.env.APP_SERVER_TIMEOUT || 60000),
    },
    allowedIPs: (process.env.ALLOWED_IPS || "").split(","),
    clamAVPath: "clamdscan",
    statuses: {
        clean: "CLEAN",
        infected: "INFECTED",
        error: "ERROR"
    },
    aws: {
        accessKey: process.env.AWS_ACCESS_KEY,
        secretKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION // ex) us-west-2
    },
    maxInputBytes: 100 * 1024 * 1024 // 100 MB
};
