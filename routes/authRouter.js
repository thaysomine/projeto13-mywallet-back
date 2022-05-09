import { Router } from "express";
import { validJoiSignin, validJoiSignup } from "../middlewares/joiMiddleware.js";
import { getSignUp, getSignIn, deleteUser } from "./../controllers/authController.js";

const authRouter = Router();

authRouter.post('/sign-up', validJoiSignup, getSignUp);
authRouter.post('/sign-in', validJoiSignin, getSignIn);
authRouter.delete('/logout', deleteUser);

export default authRouter;