import {Request, Response} from "express";
import {IComment} from "../ts/interfaces";
import {CommentService} from "../services/comment-service";

export class CommentController {
    static async updateComment(req: Request, res: Response) {
        try {

        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async deleteComment(req: Request, res: Response) {
        try {
            const commentService = new CommentService()

            const {id} = req.params;
            await commentService.delete(id)

            res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async getOneComment(req: Request, res: Response) {
        try {
            const commentService = new CommentService()

            const {id} = req.params;
            const findComment: IComment | undefined = await commentService.getOne(id)

            res.status(200).json(findComment)

        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }
}