import {IBlog, IPost, IUser} from "../ts/interfaces";
import {BlogModel} from "../models/blog-model";
import {PostModel} from "../models/post-model";
import mongoose, {Model, RefType, SortOrder} from "mongoose";
import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";
import {UserModel} from "../models/user-model";

export class QueryService {
    private blogRepository: BlogsRepository;
    private postRepository: PostsRepository;
    private userRepository: UsersRepository;
    private postModel: Model<IPost>;
    private blogModel: Model<IBlog>;
    private userModel: Model<IUser>

    constructor() {
        this.blogRepository = new BlogsRepository();
        this.postRepository = new PostsRepository();
        this.userRepository = new UsersRepository();
        this.postModel = PostModel;
        this.blogModel = BlogModel;
        this.userModel = UserModel;
    }

    public async findBlog(blogId: RefType): Promise<IBlog | undefined> {
        const blog = await this.blogRepository.getOneBlog(blogId);
        if (!blog) throw new Error();

        return blog;
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
}