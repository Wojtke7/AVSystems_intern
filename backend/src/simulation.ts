import { Simulation } from "./classes/Simulation";
import { ICommand } from "./types/ICommand";
import * as fs from 'fs';

const [inputPath, outputPath] = process.argv.slice(2);
const inputJSON = fs.readFileSync(`./input/${inputPath}`, 'utf8');
const commands: ICommand[] = JSON.parse(inputJSON).commands;
const simulation = new Simulation();
const output = simulation.runSimulation(commands);

fs.writeFileSync(`./output/${outputPath}`, JSON.stringify(output));