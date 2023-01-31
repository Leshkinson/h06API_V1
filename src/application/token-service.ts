import jwt, {JwtPayload, Secret, SignOptions} from "jsonwebtoken";
import {RefType} from "mongoose";

const settings = {
    JWT_ACCESS_SECRET: "superpupersecret",
    TOKEN_LIVE_TIME: {expiresIn: "1h"}
}

export class TokenService {
    private readonly secret: Secret;
    private readonly options: SignOptions;
    
    
    constructor() {
        this.options = settings.TOKEN_LIVE_TIME;
        this.secret = settings.JWT_ACCESS_SECRET;
    }

    generateToken(payload: object): string {
        return jwt.sign(payload, this.secret, this.options);
    }

    getUserIdByToken(token: string): string | JwtPayload {
        const result = jwt.verify(token, settings.JWT_ACCESS_SECRET)
        return result
    }
}