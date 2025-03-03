import { Simulation } from "./classes/Simulation";
import { ICommand } from "./models/ICommand";
import * as fs from 'fs';

const inputJSON = fs.readFileSync('input.json', 'utf8');
const commands: ICommand[] = JSON.parse(inputJSON).commands;
const simulation = new Simulation();
const output = simulation.runSimulation(commands);

console.log(JSON.stringify(output, null, 2));
