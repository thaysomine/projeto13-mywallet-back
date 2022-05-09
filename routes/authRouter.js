import { Router } from "express";
import { getSignUp, getSignIn, deleteUser } from "./../controllers/authController.js";

const authRouter = Router();

authRouter.post('/sign-up', getSignUp);
authRouter.post('/sign-in', getSignIn);
authRouter.delete('/logout', deleteUser);

export default authRouter;