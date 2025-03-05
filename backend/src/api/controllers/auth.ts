import * as bcrypt from "bcrypt";
import { Handler, RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { db } from "../../database/db";
import { users } from "../../database/schema";
import { eq } from 'drizzle-orm';
import { authService } from "../services/authService";
 
const authServiceInstance: authService = new authService();

const signUp: RequestHandler = async (req, res, next): Promise<void> => {
  const body = req.body;
  try {
    const existingUsername = await authServiceInstance.checkUsername(body.username);

    if (existingUsername) {
      res.status(409).json({
        message: "Username is already taken",
      });
      return;
    }
    
    const token = await authServiceInstance.createUser(body.username, body.password);

    res.status(201).json({
      message: "Successfully created user",
      token: token,
    });
  
  } catch (err) {
    return next(err);
  }
};



const login: Handler = async (req, res, next) => {
  const body = req.body;
  try {
    
    const user = await authServiceInstance.checkAccountExistence(body.username);

    if (!user) {
      res.status(404).json({
        message: "Can't find user",
      });
      return 
    }

    const token = await authServiceInstance.authorizeUser(user.id, user.password, body.password);
    
    if (token) {
      res.status(200).json({
        message: "Successfully authorized",
        token: token,
      });
      return
    } 
    else {
      res.status(401).json({
        message: "Wrong Password!",
      });
      return
    }

  } catch (err) {
    return next(err);
  }
};

export { signUp, login };
