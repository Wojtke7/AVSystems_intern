import { IVehicle } from "../types/IVehicle";
import { ITrafficLight } from "../types/ITrafficLight";

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
    const activeLight = this.trafficLights.find(light => light.state === "green" || light.state === "yellow");
    const inactiveLight = this.trafficLights.find(light => light.state === "red");

    console.log(`Changing lights from ${activeLight!.road} current light: ${activeLight!.state} to ${inactiveLight!.road}`);

    if (!activeLight || !inactiveLight) return;

    if (activeLight.state === "green") {
        activeLight.state = "yellow";
    } else if (activeLight.state === "yellow") {
        activeLight.state = "red";
        inactiveLight.state = "green";
        activeLight.vehiclesPassed = 0;
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

  private isRightTurn(vehicle: IVehicle): boolean {
    const rightTurn: { [key: string]: string } = {
      north: "west", 
      south: "east", 
      east: "north", 
      west: "south"
    };
    return vehicle.endRoad === rightTurn[vehicle.startRoad];
  }

  private hasCollision(vehicleA: IVehicle, vehicleB: IVehicle): boolean {
    return this.isLeftTurn(vehicleA) !== this.isLeftTurn(vehicleB);
  }

  step(): string[] {
    let leftVehicles: string[] = [];

    if (this.shouldChangeLights()) {
      this.changeLights();
      return [];
    }
    
    const activeRoads = this.trafficLights[0].state === "green" ? ["north", "south"] : ["east", "west"];
    const redRoads = activeRoads[0] === "north" ? ["east", "west"] : ["north", "south"];

    const trafficLights = this.trafficLights.find(light => light.state === "green");

    const vehicles: IVehicle[] = activeRoads.flatMap((road: string) => this.waitingVehicles[road].slice(0, 1));

    for (const road of redRoads) {
      const vehicle = this.waitingVehicles[road][0];
      if (this.waitingVehicles[road].length === 0 || !this.isRightTurn(vehicle)) continue;

      const canTurnRight = !vehicles.some((activeVehicles) => activeVehicles.endRoad === vehicle.endRoad);

      if (canTurnRight) {
        leftVehicles.push(vehicle.id);
        this.waitingVehicles[road].shift();
        console.log(`Vehicle ${vehicle.id} turned right on green filter arrow from ${road}`);
      }
    }

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
