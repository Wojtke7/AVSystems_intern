import { Simulation } from "./classes/Simulation";
import { ICommand } from "./types/ICommand";
import authRouter from "./api/routes/auth";
import userRouter from "./api/routes/user";
import { db } from "./database/db";
import * as fs from 'fs';
import express from "express";
import dotenv from "dotenv";
import cors from "cors";


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


app.listen(process.env.PORT || 3000);
