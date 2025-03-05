import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { decode } from "punycode";
dotenv.config();

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.get("Authorization");
  if (!header) {
    const error = new Error();
    error.message = "Not authenticated!";
    res.status(500).json({
      message: error.message,
      error: error,
    });
    return
  }
  
  const token = header;
  const decodeToken = jwt.verify(
    token,
    process.env.SECRET_KEY as jwt.Secret,
  ) as string;

  if (!decodeToken) {
    const error = new Error();
    error.message = "Wrong Token";
    res.status(500).json({
      message: error.message,
      error: error,
    });
    return
  }
  const { id } = jwt.decode(token, { json: true }) as { id: string };
  req.headers.authorization = id;
  next();
};

export { isAuth };
