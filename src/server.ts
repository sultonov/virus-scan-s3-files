import {default as Router} from "./router";
import {default as config} from "./config";
import express from "express";

const app = express();

app.use(express.json());
app.use(Router);

const server = app.listen(config.app.port, () => {
    console.log(`Server starting at port: ${config.app.port}`);
});

server.timeout = config.app.timeout;
