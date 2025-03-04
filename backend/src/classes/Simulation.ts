import { ICommand } from "../models/ICommand";
import { IVehicle } from "../models/IVehicle";
import { Crossroad } from "./Crossroad";

export class Simulation {
  private crossroad: Crossroad;
  private stepResults: { leftVehicles: string[] }[] = [];

  constructor() {
    this.crossroad = new Crossroad();
  }

  processCommand(command: ICommand): void {
    if (command.type === "addVehicle" && command.vehicleId && command.startRoad && command.endRoad) {
      const vehicle: IVehicle = {
        id: command.vehicleId,
        startRoad: command.startRoad,
        endRoad: command.endRoad
      };
      this.crossroad.addVehicle(vehicle);
    } else if (command.type === "step") {
      const leftVehicles = this.crossroad.step();
      console.log(leftVehicles)
      this.stepResults.push({ leftVehicles });
    }
  }

  runSimulation(commands: ICommand[]): object {
    commands.forEach((command) => this.processCommand(command));
    return { stepStatuses: this.stepResults };
  }
}
