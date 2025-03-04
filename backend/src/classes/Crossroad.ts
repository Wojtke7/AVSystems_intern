import { IVehicle } from "../models/IVehicle";
import { ITrafficLight } from "../models/ITrafficLight";

export class Crossroad {
  private trafficLights: ITrafficLight[] = [
    { road: "north_south", state: "green", vehiclesPassed: 0 },
    { road: "east_west", state: "red", vehiclesPassed: 0 },
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

  private stepsSinceLastChange = 0;

  private shouldChangeLights(): boolean {
    const activeLight = this.trafficLights.find(light => light.state === "green" || light.state === "yellow");
    if (!activeLight) return false;
    if (activeLight.state === "yellow") return true;
    

    const waitingVehiclesCount = activeLight.road === "north_south"
      ? this.waitingVehicles.north.length + this.waitingVehicles.south.length
      : this.waitingVehicles.east.length + this.waitingVehicles.west.length;

    return waitingVehiclesCount === 0 || (activeLight.vehiclesPassed >= waitingVehiclesCount && this.stepsSinceLastChange > 5) || this.stepsSinceLastChange >= 10;
  }


  private changeLights(): void {
    if (this.trafficLights[0].state === "green") {
      this.trafficLights[0].state = "yellow";
    } else if (this.trafficLights[0].state === "yellow") {
      this.trafficLights[0].state = "red";
      this.trafficLights[1].state = "green";

      this.trafficLights[0].vehiclesPassed = 0;
    } else if (this.trafficLights[1].state === "green") {
      this.trafficLights[1].state = "yellow";
    } else if (this.trafficLights[1].state === "yellow") {
      this.trafficLights[1].state = "red";
      this.trafficLights[0].state = "green";

      this.trafficLights[1].vehiclesPassed = 0;
    }
    this.stepsSinceLastChange = 0;
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

    if (this.shouldChangeLights()) {
      console.log("Lights changed");
      this.changeLights();
      return [];
    }
    
    const activeRoads = this.trafficLights[0].state === "green" ? ["north", "south"] : ["east", "west"];
    const trafficLights = this.trafficLights.find(light => light.state === "green");
    const vehicles: IVehicle[] = activeRoads.flatMap((road: string) => this.waitingVehicles[road].slice(0, 1));

    if (vehicles.length === 2 && !this.hasCollision(vehicles[0], vehicles[1])) {
      leftVehicles.push(vehicles[0].id, vehicles[1].id);
      this.waitingVehicles[vehicles[0].startRoad].shift();
      this.waitingVehicles[vehicles[1].startRoad].shift();
      trafficLights!.vehiclesPassed += 2;
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
      trafficLights!.vehiclesPassed++;
    }
    else if (vehicles.length > 0) {
      leftVehicles.push(vehicles[0].id);
      this.waitingVehicles[vehicles[0].startRoad].shift();
      trafficLights!.vehiclesPassed++;
    }

    this.stepsSinceLastChange++;
    return leftVehicles;
  }
}
