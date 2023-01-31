import {Request, Response} from "express";
import {IUser} from "../ts/interfaces";
//import {SortOrder} from "mongoose";
import {UsersRequest} from "../ts/types";
import {UserService} from "../services/user-service";
import {QueryService} from "../services/query-service";
import jwt from "jsonwebtoken"
import {TokenService} from "../application/token-service";
import {TokenMapper} from "../dto/mappers/token-mapper";

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const userService = new UserService()
            const queryService = new QueryService();

            let {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm} = req.query as UsersRequest
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const users: IUser[] = await userService.getAll(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm);
            const totalCount: number = await queryService.getTotalCountForUsers(searchLoginTerm, searchEmailTerm);

            res.status(200).json({
                "pagesCount": Math.ceil(totalCount / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": totalCount,
                "items": users,
            });
        } catch (error) {
            if (error instanceof Error)
                throw new Error(error.message);
        }
    }

    static async createUser(req: Request, res: Response) {
        try {
            const userService = new UserService();

            const {login, password, email} = req.body;
            const newUser: IUser = await userService.create(login, password, email);

            res.status(201).json(newUser);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const userService = new UserService();

            const {id} = req.params;
            await userService.delete(id);

            res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const userService = new UserService();
            const tokenService = new TokenService();

            const {loginOrEmail, password} = req.body;
            const user = await userService.verifyUser(loginOrEmail, password);

            if (user) {
                const token = tokenService.generateToken(TokenMapper.prepareModel(user))

                res.status(200).json({
                    "accessToken": token
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(401);
                console.log(error.message);
            }
        }
    }
}