import jwt, {JwtPayload, Secret, SignOptions} from "jsonwebtoken";

const settings = {
    JWT_ACCESS_SECRET: "superpupersecret",
    TOKEN_LIVE_TIME: {expiresIn: "14h"}
}
export interface JWT extends JwtPayload {
    id: string;
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

    getUserIdByToken(token: string): string | JwtPayload | JWT {
        return jwt.verify(token, settings.JWT_ACCESS_SECRET)
    }
}