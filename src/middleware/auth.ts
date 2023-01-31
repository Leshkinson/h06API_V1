import {Request, Response, NextFunction} from "express";
import {QueryService} from "../services/query-service";
import {TokenService} from "../application/token-service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)

        return;
    }

    const token = req.headers.authorization.split(' ')[1]
    const tokenService = new TokenService()
    const queryService = new QueryService()
    const userId = await tokenService.getUserIdByToken(token)

    if (!userId) {
        res.sendStatus(401)

        return;
    }
    const user = await queryService.findUser(userId)

    if (!user) {
        res.sendStatus(401)

        return;
    }

    next()

}