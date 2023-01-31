import express from "express";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import bodyParser from "body-parser";
import {router} from "./router/router";
import {serverConfigService} from "./config/config.service";

dotenv.config()

const app = express();

app.use(bodyParser.json());
app.use('/', router);

const start = async (): Promise<void> => {
    try {
        const PORT = serverConfigService.getPort() || 4546;
        await mongoose.connect('mongodb+srv://Oleg_Lopatko:o1l9E9g3@cluster0.dc6pgzh.mongodb.net/?retryWrites=true&w=majority');
        mongoose.set('strictQuery', true)
        app.listen(PORT, () => {
            console.log(`Server has been listening on port http://localhost:${PORT}`)
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}

start()
    .then(() => {
        console.log('Good start')
    })
    .catch(error => {
        console.log(error.message)
    })