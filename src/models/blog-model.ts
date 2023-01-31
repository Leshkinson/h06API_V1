import {IBlog} from "../ts/interfaces";
import mongoose, {Schema} from "mongoose";

export const BlogSchema = new Schema({
    //_id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: "string", required: true},
    description: {type: "string", required: true},
    websiteUrl: {type: "string", required: true},
}, {timestamps: true})

BlogSchema.set('toJSON', {
    transform: function (doc, dto) {
        dto.id = dto._id;
        delete dto._id;
        delete dto.__v;
        delete dto.updatedAt;
    }
});

BlogSchema.set('id', true);

export const BlogModel = mongoose.model<IBlog>('Blog', BlogSchema);
