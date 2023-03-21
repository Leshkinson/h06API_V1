import {Request, Response} from "express";
import {IComment} from "../ts/interfaces";
import {CommentService} from "../services/comment-service";
import {JWT, TokenService} from "../application/token-service";
import {QueryService} from "../services/query-service";
// import {CustomError} from "../middleware/catch-error";

export class CommentController {

    static async updateComment(req: Request, res: Response) {
        try {
            const commentService = new CommentService();
            const tokenService = new TokenService();
            const queryService = new QueryService();
            const {id} = req.params;
            const {content} = req.body;
            const token = req.headers.authorization?.split(' ')[1]
            if (token) {
                const payload = await tokenService.getUserIdByToken(token) as JWT

                const user = await queryService.findUser(payload.id);

                if(!user) res.sendStatus(404)
                const comment: IComment | undefined = await commentService.getOne(id)
                if(!comment) res.sendStatus(404)
                if(comment?.commentatorInfo.userLogin !== user?.login || comment?.commentatorInfo.userId !== user?._id) res.sendStatus(403)
                const updatedComment: IComment | undefined = await commentService.update(id, content)

                if (updatedComment) res.sendStatus(204);
            }
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
            const tokenService = new TokenService();
            const queryService = new QueryService();
            const {id} = req.params;
            const token = req.headers.authorization?.split(' ')[1]
            if (token) {
                const payload = await tokenService.getUserIdByToken(token) as JWT
                const user = await queryService.findUser(payload.id);

                if(!user) {
                    res.sendStatus(404)
                    return
                }

                const comment: IComment | undefined = await commentService.getOne(id);

                if(!comment){
                    res.sendStatus(404)
                    return
                }

                if(comment?.commentatorInfo.userLogin !== user?.login || comment?.commentatorInfo.userId !== user?._id.toString()) {
                    res.sendStatus(403)
                    return
                }

                await commentService.delete(id);

                res.sendStatus(204);
            }
        } catch (error) {
            // if (error instanceof CustomError){
            //     res.sendStatus(error.code);
            //     console.log('CustomError', error.code);
            // } else
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