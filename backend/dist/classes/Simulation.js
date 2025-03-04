"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation = void 0;
const Crossroad_1 = require("./Crossroad");
class Simulation {
    constructor() {
        this.stepResults = [];
        this.crossroad = new Crossroad_1.Crossroad();
    }
    processCommand(command) {
        if (command.type === "addVehicle" && command.vehicleId && command.startRoad && command.endRoad) {
            const vehicle = {
                id: command.vehicleId,
                startRoad: command.startRoad,
                endRoad: command.endRoad
            };
            this.crossroad.addVehicle(vehicle);
        }
        else if (command.type === "step") {
            const leftVehicles = this.crossroad.step();
            console.log(leftVehicles);
            this.stepResults.push({ leftVehicles });
        }
    }
    runSimulation(commands) {
        commands.forEach((command) => this.processCommand(command));
        return { stepStatuses: this.stepResults };
    }
}
exports.Simulation = Simulation;
