import { db } from "../../database/db";
import { users } from "../../database/schema";
import * as bcrypt from "bcrypt";
import { eq } from 'drizzle-orm';
import * as jwt from "jsonwebtoken";
import { IUser } from "../../types/IUser";


export class authService {
    async checkUsername(username: string): Promise<boolean> {
        try {
            const existingUsername = await db.select().from(users).where(eq(users.username, username));
            return existingUsername.length > 0;
        } catch (error) {
            throw new Error("Error checking username availability");
        }
    }

    async createUser(username: string, password: string): Promise<string> {
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await db.insert(users).values({
                username: username,
                password: hashedPassword,
            }).returning();

            const token = jwt.sign(
                { id: user[0].id.toString() },
                process.env.SECRET_KEY as string
            );

            return token;
        } catch (error) {
            throw new Error("Error creating user");
        }
    }

    async checkAccountExistence(username: string): Promise<IUser | null> {
        try {
            const user = await db.select().from(users).where(eq(users.username, username));
            return user.length > 0 ? user[0] : null;
        } catch (error) {
            throw new Error("Error checking account existence");
        }
    }

    async authorizeUser(userId: any, userPassword: string, bodyPassword: string): Promise<string | null> {
        try {
            const result = bcrypt.compareSync(bodyPassword, userPassword);
            if (result) {
                const token = jwt.sign(
                    { id: userId.toString() },
                    process.env.SECRET_KEY as string
                );
                return token;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error("Error authorizing user");
        }
    }
}