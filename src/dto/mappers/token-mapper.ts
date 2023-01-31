import {IUser} from "../../ts/interfaces";

export class TokenMapper {
    public static prepareModel(model: IUser) {
        return {
            id: model._id
        }
    }
}