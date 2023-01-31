import {IUser} from "../ts/interfaces";
import {UserModel} from "../models/user-model";
import {Model, RefType, SortOrder} from "mongoose";

export class UsersRepository {
    private userModel: Model<IUser>;

    constructor() {
        this.userModel = UserModel;
    }

    public async getAllUsers(
        sortBy: string = 'createdAt',
        sortDirection: SortOrder = 'desc',
        skip: number = 0,
        limit: number = 10,
        searchLoginTerm: { login: { $regex: RegExp } } | {} = {},
        searchEmailTerm: { email: { $regex: RegExp } } | {} = {},
    ): Promise<IUser[]> {

        return this.userModel.find({$or: [searchLoginTerm, searchEmailTerm]}).sort({[sortBy]: sortDirection}).skip(skip).limit(limit);
    }

    public async findUser(loginOrEmail: string): Promise<IUser | null> {
        return this.userModel.findOne({$or: [{"login": loginOrEmail}, {"email": loginOrEmail}]})
    }

    public async getUsersCount(searchLoginTerm: { login: { $regex: RegExp } } | {} = {}, searchEmailTerm: { email: { $regex: RegExp } } | {} = {}): Promise<number> {
        return this.userModel.countDocuments({$or: [searchLoginTerm, searchEmailTerm]});
    }

    public async createUser(login: string, password: string, email: string): Promise<IUser> {
        return await this.userModel.create({login, password, email});
    }

    public async deleteUser(id: RefType) {
        return this.userModel.findOneAndDelete({_id: id});
    }

    public async deleteAll() {
        return this.userModel.deleteMany();
    }
}