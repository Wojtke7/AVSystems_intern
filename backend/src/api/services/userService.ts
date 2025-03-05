import { run } from "node:test";
import { db } from "../../database/db";
import { jsons } from "../../database/schema";
import { ICommand } from "../../types/ICommand";
import { Simulation } from "../../classes/Simulation";
import { eq } from "drizzle-orm";


export class UserService {
    async uploadJson(json: string, userId: number, fileName: string): Promise<object | undefined> {
        try {
            const parsedJson = JSON.parse(json);
            const output: object | undefined = await this.runSimulation(json)

            if (!output) {
                return undefined;
            }

            await db.insert(jsons).values({
                input: parsedJson,
                userId: userId,
                output: output,
                fileName: fileName
            }).execute();

            return output

        } catch (err) {
            console.error("Error uploading json:", err);
        }
    }
    

    async getJsons(userId: number): Promise<any> {
        try {
            const jsons_ = await db.select({ input: jsons.input, output: jsons.output }).from(jsons).where(eq(jsons.userId, userId));
            return jsons_
        } catch (err) {
            console.error("Error getting jsons:", err);
        }
        return undefined;
    }
    

    // async getJson (id: number): Promise<string> {

    // }

    async runSimulation(inputJSON: string): Promise<object | undefined> {
        try {
            const commands: ICommand[] = JSON.parse(inputJSON);
            const simulation = new Simulation();
            const output = simulation.runSimulation(commands);
            return output;
        }
        catch (err) {
            console.error("Error running simulation:", err);
        }
    }
}