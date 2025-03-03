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
  private isLeftTurn(vehicle: IVehicle): boolean {
    const leftTurn: { [key: string]: string } = {
      north: "east", 
      south: "west", 
      east: "south", 
      west: "north"
    };
    return vehicle.endRoad === leftTurn[vehicle.startRoad];
  }

  private hasCollision(vehicleA: IVehicle, vehicleB: IVehicle): boolean {
    return this.isLeftTurn(vehicleA) !== this.isLeftTurn(vehicleB);
  }

  step(): string[] {
    let leftVehicles: string[] = [];
    const activeRoads = this.trafficLights[0].state === "green" ? ["north", "south"] : ["east", "west"];
    const vehicles: IVehicle[] = activeRoads.flatMap((road: string) => this.waitingVehicles[road].slice(0, 1));

    if (vehicles.length === 2 && !this.hasCollision(vehicles[0], vehicles[1])) {
      leftVehicles.push(vehicles[0].id, vehicles[1].id);
      this.waitingVehicles[vehicles[0].startRoad].shift();
      this.waitingVehicles[vehicles[1].startRoad].shift();
    } 
    else if (vehicles.length === 2 && this.hasCollision(vehicles[0], vehicles[1])) {
      if (this.isLeftTurn(vehicles[0])) {
        leftVehicles.push(vehicles[1].id);
        this.waitingVehicles[vehicles[1].startRoad].shift();
      }
      else {
        leftVehicles.push(vehicles[0].id);
        this.waitingVehicles[vehicles[0].startRoad].shift();
      }
    }
    else if (vehicles.length > 0) {
      leftVehicles.push(vehicles[0].id);
      this.waitingVehicles[vehicles[0].startRoad].shift();
    }
    return leftVehicles;
  }
}
