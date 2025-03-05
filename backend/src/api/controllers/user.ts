import { Handler, NextFunction } from "express";
import { ICommand } from "../../types/ICommand";
import { Simulation } from "../../classes/Simulation";
import { UserService } from "../services/userService";
import { Request } from "express";
import { Response } from "express";

const userServiceInstance: UserService = new UserService();

const submitJson: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const {commands, fileName}  = req.body;
    const id: number = Number(req.get("Authorization"));
    try {
        const output = await userServiceInstance.uploadJson(JSON.stringify(commands), id, fileName);
        res.status(200).json({ message: "Success", simulation: output });
    } catch (err) {
        next(err)
    }
}

const getJsons: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const id: number = Number(req.get("Authorization"));
    try {
        const jsons = await userServiceInstance.getJsons(id);
        res.status(200).json({ message: "Success", jsons });
    } catch (err) {
        next(err)
    }
}

export { submitJson, getJsons };