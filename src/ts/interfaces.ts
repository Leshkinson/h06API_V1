import mongoose from "mongoose";

export interface IBlog {
    _id: mongoose.Schema.Types.ObjectId ;
    name: string;
    description: string;
    websiteUrl: string;
}

export interface IPost {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
}

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId;
    login: string;
    email: string;
    password: string;
}