import { Router } from "express";
import validToken from "../middlewares/userMiddleware.js";

import { getAccount, postAccount } from "./../controllers/accountController.js";

const accountRouter = Router();

accountRouter.get('/account', validToken, getAccount);
accountRouter.post('/account', postAccount);

export default accountRouter;
