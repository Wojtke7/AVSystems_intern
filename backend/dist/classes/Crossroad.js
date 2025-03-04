"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crossroad = void 0;
class Crossroad {
    constructor() {
        this.trafficLights = [
            { road: "north_south", state: "green", vehiclesPassed: 0 },
            { road: "east_west", state: "red", vehiclesPassed: 0 },
        ];
        this.waitingVehicles = {
            north: [],
            south: [],
            east: [],
            west: []
        };
        this.stepsSinceLastChange = 0;
    }
    addVehicle(vehicle) {
        this.waitingVehicles[vehicle.startRoad].push(vehicle);
    }
    shouldChangeLights() {
        const activeLight = this.trafficLights.find(light => light.state === "green" || light.state === "yellow");
        if (!activeLight)
            return false;
        if (activeLight.state === "yellow")
            return true;
        const waitingVehiclesCount = activeLight.road === "north_south"
            ? this.waitingVehicles.north.length + this.waitingVehicles.south.length
            : this.waitingVehicles.east.length + this.waitingVehicles.west.length;
        return waitingVehiclesCount === 0 || (activeLight.vehiclesPassed >= waitingVehiclesCount && this.stepsSinceLastChange > 5) || this.stepsSinceLastChange >= 10;
    }
    changeLights() {
        if (this.trafficLights[0].state === "green") {
            this.trafficLights[0].state = "yellow";
        }
        else if (this.trafficLights[0].state === "yellow") {
            this.trafficLights[0].state = "red";
            this.trafficLights[1].state = "green";
            this.trafficLights[0].vehiclesPassed = 0;
        }
        else if (this.trafficLights[1].state === "green") {
            this.trafficLights[1].state = "yellow";
        }
        else if (this.trafficLights[1].state === "yellow") {
            this.trafficLights[1].state = "red";
            this.trafficLights[0].state = "green";
            this.trafficLights[1].vehiclesPassed = 0;
        }
        this.stepsSinceLastChange = 0;
    }
    isLeftTurn(vehicle) {
        const leftTurn = {
            north: "east",
            south: "west",
            east: "south",
            west: "north"
        };
        return vehicle.endRoad === leftTurn[vehicle.startRoad];
    }
    hasCollision(vehicleA, vehicleB) {
        return this.isLeftTurn(vehicleA) !== this.isLeftTurn(vehicleB);
    }
    step() {
        let leftVehicles = [];
        if (this.shouldChangeLights()) {
            console.log("Lights changed");
            this.changeLights();
            return [];
        }
        const activeRoads = this.trafficLights[0].state === "green" ? ["north", "south"] : ["east", "west"];
        const trafficLights = this.trafficLights.find(light => light.state === "green");
        const vehicles = activeRoads.flatMap((road) => this.waitingVehicles[road].slice(0, 1));
        if (vehicles.length === 2 && !this.hasCollision(vehicles[0], vehicles[1])) {
            leftVehicles.push(vehicles[0].id, vehicles[1].id);
            this.waitingVehicles[vehicles[0].startRoad].shift();
            this.waitingVehicles[vehicles[1].startRoad].shift();
            trafficLights.vehiclesPassed += 2;
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
            trafficLights.vehiclesPassed++;
        }
        else if (vehicles.length > 0) {
            leftVehicles.push(vehicles[0].id);
            this.waitingVehicles[vehicles[0].startRoad].shift();
            trafficLights.vehiclesPassed++;
        }
        this.stepsSinceLastChange++;
        return leftVehicles;
    }
}
exports.Crossroad = Crossroad;
