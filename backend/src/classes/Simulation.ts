import { ICommand } from "../types/ICommand";
import { IVehicle } from "../types/IVehicle";
import { Crossroad } from "./Crossroad";

export class Simulation {
  private crossroad: Crossroad;
  private stepResults: { leftVehicles: string[] }[] = [];

  constructor() {
    this.crossroad = new Crossroad();
  }

  processCommand(command: ICommand, step: Number): void {
    if (command.type === "addVehicle" && command.vehicleId && command.startRoad && command.endRoad) {
      const vehicle: IVehicle = {
        id: command.vehicleId,
        startRoad: command.startRoad,
        endRoad: command.endRoad
      };
      this.crossroad.addVehicle(vehicle);
      console.log(`Step ${step}: Added vehicle ${command.vehicleId}`);
    } else if (command.type === "step") {
      const leftVehicles = this.crossroad.step();
      if (leftVehicles.length === 0) {
        console.log(`Step ${step}: No vehicles left`);
      } else {
        console.log(`Step ${step}: [${leftVehicles}] left`);
      }
      this.stepResults.push({ leftVehicles });
    }
  }

  runSimulation(commands: ICommand[]): object {
    commands.forEach((command, index) => this.processCommand(command, index));
    return { stepStatuses: this.stepResults };
  }
}
