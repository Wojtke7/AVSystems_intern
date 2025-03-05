import { Simulation } from "./classes/Simulation";
import { ICommand } from "./types/ICommand";
// import userRouter  from "./api/routes/user";
import authRouter from "./api/routes/auth";
import userRouter from "./api/routes/user";
import { db } from "./database/db";
import * as fs from 'fs';
import { Client } from "pg";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";


const [inputPath, outputPath] = process.argv.slice(2);
const inputJSON = fs.readFileSync(`./src/input/${inputPath}`, 'utf8');
const commands: ICommand[] = JSON.parse(inputJSON).commands;
const simulation = new Simulation();
const output = simulation.runSimulation(commands);

fs.writeFileSync(`./src/output/${outputPath}`, JSON.stringify(output));

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'input', 'X-Requested-With', 'Origin', 'Accept'],
  }));
app.use(express.json());

app.use((req, res, next) => {
  next();
});

app.use("/user", userRouter);

app.use("/auth", authRouter);


const httpServer = app.listen(process.env.PORT || 3000);
console.log(`Server is running on port ${process.env.PORT || 3000}`);
