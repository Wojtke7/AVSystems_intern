"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const db_1 = require("../../database/db");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const signUp = async (req, res, next) => {
    const body = req.body;
    try {
        const existingUsername = await db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, body.username));
        if (existingUsername.length > 0) {
            res.status(409).json({
                message: "Username is already taken",
            });
        }
        else {
            res.status(200).json({
                message: "Username is available"
            });
        }
        // const user = await User.create({
        //   ...req.body,
        //   accountType: "standart",
        //   password: await bcrypt.hash(req.body.password, 12),
        // });
        // const token = await jwt.sign(
        //   { id: user._id.toString() },
        //   process.env.SECRET_KEY as string,
        // );
        // await user.save();
        // ``;
        // res.status(201).json({
        //   message: "Succesfully created user",
        //   token: token,
        // });
    }
    catch (err) {
        return next(err);
    }
};
exports.signUp = signUp;
