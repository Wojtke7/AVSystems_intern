import { IVehicle } from "../models/IVehicle";
import { ITrafficLight } from "../models/ITrafficLight";

export class Crossroad {
  private trafficLights: ITrafficLight[] = [
    { road: "north_south", state: "green" },
    { road: "east_west", state: "red" }
  ];
  
  private waitingVehicles: { [key: string]: IVehicle[] } = {
    north: [],
    south: [],
    east: [],
    west: []
  };

  constructor() {}

  addVehicle(vehicle: IVehicle): void {
    this.waitingVehicles[vehicle.startRoad].push(vehicle);
  }

  private changeLights(): void {
    if (this.trafficLights[0].state === "green") {
      this.trafficLights[0].state = "yellow";
    } else if (this.trafficLights[0].state === "yellow") {
      this.trafficLights[0].state = "red";
      this.trafficLights[1].state = "green";
    } else if (this.trafficLights[1].state === "green") {
      this.trafficLights[1].state = "yellow";
    } else if (this.trafficLights[1].state === "yellow") {
      this.trafficLights[1].state = "red";
      this.trafficLights[0].state = "green";
    }
  }

  private hasCollision(vehicle: IVehicle, otherVehicles: IVehicle[]): boolean {
    const oppositeRoad: { [key: string]: string } = {
      north: "south",
      south: "north",
      east: "west",
      west: "east"
    };

    const rightTurnPriority: { [key: string]: string } = {
      north: "west",
      south: "east",
      east: "north",
      west: "south"
    };

    for (const other of otherVehicles) {
      if (other.endRoad === vehicle.startRoad) {
        return true;
      }
      if (
        vehicle.endRoad === rightTurnPriority[vehicle.startRoad] &&
        other.startRoad === oppositeRoad[vehicle.startRoad] && // Necessary?
        other.endRoad !== rightTurnPriority[other.startRoad]
      ) {
        return true;
      }
    }
    return false;
  }

  step(): string[] {
    let leftVehicles: string[] = [];
    const activeRoads = this.trafficLights[0].state === "green" ? ["north", "south"] : ["east", "west"];
    
    for (const road of activeRoads) {
      if (this.waitingVehicles[road].length === 0) continue;

      const vehiclesToProcess = [...this.waitingVehicles[road]];
      for (const vehicle of vehiclesToProcess) {
        if (!this.hasCollision(vehicle, vehiclesToProcess)) {
          leftVehicles.push(vehicle.id);
          this.waitingVehicles[road] = this.waitingVehicles[road].filter(v => v.id !== vehicle.id);
        }
      }
    }
    
    this.changeLights();
    return leftVehicles;
  }
}
