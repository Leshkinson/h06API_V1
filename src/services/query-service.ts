import {IBlog, IComment, IPost, IUser} from "../ts/interfaces";
import {BlogModel} from "../models/blog-model";
import {PostModel} from "../models/post-model";
import {CommentModel} from "../models/comment-model";
import mongoose, {Model, RefType, SortOrder} from "mongoose";
import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";
import {UserModel} from "../models/user-model";
import {JwtPayload} from "jsonwebtoken";
import {JWT, TokenService} from "../application/token-service";
import {CommentsRepository} from "../repositories/comments-repository";

export class QueryService {
    private blogRepository: BlogsRepository;
    private postRepository: PostsRepository;
    private userRepository: UsersRepository;
    private postModel: Model<IPost>;
    private blogModel: Model<IBlog>;
    private userModel: Model<IUser>;
    private commentModel: Model<IComment>

    constructor() {
        this.blogRepository = new BlogsRepository();
        this.postRepository = new PostsRepository();
        this.userRepository = new UsersRepository();
        this.postModel = PostModel;
        this.blogModel = BlogModel;
        this.userModel = UserModel;
        this.commentModel = CommentModel;
    }

    public async findBlog(blogId: RefType): Promise<IBlog | undefined | null> {
        const blog = await this.blogRepository.getOneBlog(blogId);
        if (!blog) throw new Error();

        return blog;
    }

    public async findPost(postId: RefType): Promise<IPost | undefined | null> {

        const post = await this.postRepository.getOnePost(postId);

        if (!post) throw new Error();

        return post
    }

    public async findUser(id: string | JwtPayload): Promise<IUser | undefined | null> {
        const user = await this.userRepository.findUserById(id)
        console.log('User', user)
        // if (!user) throw new Error();

        return user;
    }

    public async getTotalCountForBlogs(searchNameTerm: string | undefined | object): Promise<number> {
        if (searchNameTerm)
            searchNameTerm = {name: {$regex: new RegExp(`.*${searchNameTerm}.*`, 'i')}};

        return await this.blogRepository.getBlogsCount(searchNameTerm);
    }

    public async getTotalCountForUsers(searchLoginTerm: string | undefined | object, searchEmailTerm: string | undefined | object): Promise<number> {
        if (searchLoginTerm)
            searchLoginTerm = {login: {$regex: new RegExp(`.*${searchLoginTerm}.*`, 'i')}};
        if (searchEmailTerm)
            searchEmailTerm = {email: {$regex: new RegExp(`.*${searchEmailTerm}.*`, 'i')}};

        return await this.userRepository.getUsersCount(searchLoginTerm, searchEmailTerm);
    }


    public async getTotalCountForPosts(): Promise<number> {
        return this.postModel.find().count();
    }

    public async getTotalCountPostsForTheBlog(blogId: RefType): Promise<number> {
        const blog = await this.findBlog(blogId);

        return this.postModel.find({blogId: (blog?._id)?.toString()}).count();
    }

    public async createPostForTheBlog(
        blogId: RefType,
        title: string,
        shortDescription: string,
        content: string): Promise<IPost> {
        const blog = await this.findBlog(blogId);
        if (blog) {
            const blogId = new mongoose.Types.ObjectId((blog?._id).toString());

            return await this.postModel.create({title, shortDescription, content, blogId, blogName: blog?.name});
        }
        throw new Error();
    }

    public async getPostsForTheBlog(
        blogId: RefType,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = 'createdAt',
        sortDirection: SortOrder = 'desc'): Promise<IPost[]> {
        const blog = await this.findBlog(blogId);
        const skip: number = (+pageNumber - 1) * +pageSize;
        if (blog) {
            return this.postModel.find({blogId: (blog?._id)?.toString()}).sort({[sortBy]: sortDirection}).skip(skip).limit(+pageSize);
        }
        throw new Error();
    }

    public async createCommentForThePost(postId: RefType, content: string, token: string): Promise<IComment> {
        const tokenService = new TokenService();
        const queryService = new QueryService();
        const commentRepository = new CommentsRepository()
        const post = await this.findPost(postId)

        if (post) {
            const payload = await tokenService.getUserIdByToken(token) as JWT
            console.log('payload query-service', payload)
            const user = await queryService.findUser(payload.id)
            console.log('User', user)
            if (user) {
                console.log('Here2')
                console.log({content});
                console.log({postId});
                console.log('payload.id', payload.id);
                console.log('login', user.login);
                const comm = await commentRepository.createComment(content, postId, payload.id, user.login)
                console.log('Comment', comm)
                return comm
            }
        }

        throw new Error();
    }

    public async getCommentsForThePost(
        postId: RefType,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = 'createdAt',
        sortDirection: SortOrder = 'desc'): Promise<IComment[]> {
        console.log('here2')
        const post = await this.findPost(postId);
        console.log('Post', post)
        const skip: number = (+pageNumber - 1) * +pageSize;
        if (post) {
            const comments = await this.commentModel.find({postId: (post?._id)?.toString()}).sort({[sortBy]: sortDirection}).skip(skip).limit(+pageSize);
            console.log('query-service comments', comments)
            return comments
        }
        throw new Error();
    }

    public async getTotalCountCommentsForThePost(postId: RefType): Promise<number> {
        const post = await this.findPost(postId);

        return this.commentModel.find({postId: (post?._id)?.toString()}).count();
    }
}