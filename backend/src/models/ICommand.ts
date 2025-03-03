export interface ICommand {
    type: "addVehicle" | "step";
    vehicleId?: string;
    startRoad?: "north" | "south" | "east" | "west";
    endRoad?: "north" | "south" | "east" | "west";
  }
  