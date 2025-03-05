# AVSystems_intern
Traffic lights simulation project for AVSystems internship recruitment.

This project simulates the traffic light system at a classic crossroad with four incoming roads. In addition to the standard signalization logic, conditional light logic has been added. The main goal is to create a simulation system that mimics real-world traffic management.

As an extension of this project, a small full-stack web application has been developed to allow users to run simulations. The application includes features such as user authentication, registration, saving simulation results in a database, retrieving results, and running the simulation itself.

## **⚠️ Note**: 
The results may differ from sample sent within e-mail, because a custom logic algorithm is applied. It considers the yellow light as a simulation step during which no cars pass through (this is a deliberate operation).
&nbsp;
&nbsp;

# Algoritm explanation

The algorithm logic is located in the `Crossroads.ts` file and works as follows:

Every step is analyzed separately. In a single step we analyze every first vehicle from each side. A maximum of 4 vehicles can pass through the intersection, in case when each  turning right (two from the active lights and two from the conditional lights).

### Let's analyze the main function `step()` responsible for main algorithm logic:

```typescript
let leftVehicles: string[] = [];

if (this.shouldChangeLights()) {
  this.changeLights();
  return [];
}
```

The `leftVehicles` array defines whether the traffic lights should change.

### The traffic lights change under the following conditions:
1. If there are no vehicles on the road.
2. If more vehicles have passed through the crossroad in the current sequence than are still waiting, BUT only if at least 5 vehicles have passed (this prevents premature light changes).
3. If the light has not changed in the last 10 passes.
   
### Continuing in the step() function:
```typescript
const activeRoads = this.trafficLights[0].state === "green" ? ["north", "south"] : ["east", "west"];
const redRoads = activeRoads[0] === "north" ? ["east", "west"] : ["north", "south"];

const trafficLights = this.trafficLights.find(light => light.state === "green");

const vehicles: IVehicle[] = activeRoads.flatMap((road: string) => this.waitingVehicles[road].slice(0, 1));
```
Here, we determine the active and inactive roads. Then we choose the first vehicle waiting on each active road to enter the intersection.

### Here is the logic responsible for conditional turns from inactive roads:
```typescript
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
```

If there are any vehicles from the `activeRoad` going in the same direction as the vehicle currently being checked, it will be impossible for the vehicle to turn right at this step.

### Then we have the logic for vehicles from active roads
```typescript
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
```

### 1. Two vehicles from opposite directions (no collision):
  If two vehicles are waiting from opposite directions and there are no collisions, both vehicles can safely pass through the intersection. They are both added to `leftVehicles`, and the respective vehicles are removed from the `waitingVehicles` queue.

### 2. Two vehicles with collision:
When there is a collision between two vehicles (e.g., both trying to go in the same direction), the algorithm checks if the first vehicle is turning left.

* If yes, the second vehicle is allowed to pass first.
* If no, the second vehicle is assumed to be turning left, and the first vehicle has priority to pass.

### 3. One vehicle waiting on the active road:
If only one vehicle is waiting on the active road, it can always pass through without any issue.

### 4. Incrementing steps:
After each check, the stepsSinceLastChange counter is incremented, ensuring that the traffic lights will eventually change after a certain number of steps.  

&nbsp;
&nbsp;

## Features

- **Traffic Light Simulation**: A simulation of traffic lights at an intersection with four roads.
- **Conditional Traffic Lights**: Added logic for conditional traffic lights based on traffic flow.
- **User Authentication**: Users can sign up and log in to the system.
- **Database Integration**: Results from simulations are stored and retrieved from a database.
- **Web Application**: A full-stack web application built with frontend and backend components.
  

## Technologies Used

- **Backend**: Node.js, TypeScript
- **Frontend**: React 
- **Authentication**: JWT, bcrypt
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Web Framework**: Express.js


## How to Run the Project

### Traffic Simulation

- The input files are retrieved from the `backend/src/input` folder.
- The simulation results are saved in the `backend/src/output` folder.
  
To run the simulation, follow these steps:

1. Navigate to the `backend/src` directory:
   ```bash
   cd backend/src
2. Run the simulation using the following command:
   ```bash
   npx ts-node input.json output.json

## Running the Web Application
To run the web application, follow these steps:

1. Ensure you add the .env file (provided in the email for the recruiter) to the backend directory.

2. Install the required dependencies for both backend and frontend:
  ```bash
  # In the root directory
  npm install

  # In the backend directory
  cd backend
  npm install
  
  # In the frontend directory
  cd frontend
  npm install
  ```

3. A  script has been prepared to run the entire application from the root directory. To do this, follow these steps:
  ```bash
  # Run the command from the root directory
  npm start
  ```
This script will start both the backend and frontend services, and you can access the web application as described in the previous section.

&nbsp;
&nbsp;
## Motivation to add the web app extension
 - I would like to work as a backend/full stack engineer, that's why I thought it will be a great opportunity, to show my skills by extending the project in this way 😊

## Additional Information

- After each simulation run, logs of the simulation's progress can be found in the backend console.
 
# Screenshots 

![Screenshot 1](https://github.com/user-attachments/assets/dcd05789-906d-4cd5-8f98-ffb647f69168)
### *Screenshot 1: Register page.*

![Screenshot 2](https://github.com/user-attachments/assets/ff373b60-5d7f-4a9c-a9a4-98614bc98a5c)
### *Screenshot 2: Login page.*

![Screenshot 3](https://github.com/user-attachments/assets/27392bad-699d-4223-bf3f-4e7ce9cd2277)
### *Screenshot 3: Main simulation page.*

![Screenshot 4](https://github.com/user-attachments/assets/ad8299f9-1ca0-4013-8fc1-fd1e0e581527)
### *Screenshot 4: User simulations.*

![Screenshot 5](https://github.com/user-attachments/assets/de20d514-fe76-486e-9678-a8a823d5dfc1)
### *Screenshot 5: Logs in backend console.*


---

## **Author**: Wojciech Marcela





