import {IComment} from "../ts/interfaces";
import {Model, RefType} from "mongoose";
import {CommentModel} from "../models/comment-model";

export class CommentsRepository {
    private commentModel: Model<IComment>;

    constructor() {
        this.commentModel = CommentModel;
    }

    public async getOneComment(id: RefType): Promise<IComment | null> {
        return this.commentModel.findById({_id: id});
    }

    public async deleteComment(id: RefType) {
        return this.commentModel.findOneAndDelete({_id: id});
    }
}