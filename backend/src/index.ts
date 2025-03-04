import { Simulation } from "./classes/Simulation";
import { ICommand } from "./models/ICommand";
import * as fs from 'fs';

const inputJSON = fs.readFileSync('./src/input/input2.json', 'utf8');
const commands: ICommand[] = JSON.parse(inputJSON).commands;
const simulation = new Simulation();
const output = simulation.runSimulation(commands);

fs.writeFileSync('./src/output/output2.json', JSON.stringify(output));