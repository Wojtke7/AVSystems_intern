export interface ITrafficLight {
    road: "north_south" | "east_west";
    state: "green" | "yellow" | "red";
    vehiclesPassed: number
}  