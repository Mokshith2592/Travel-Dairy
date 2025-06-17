import { fileURLToPath } from "url";
import TravelStory from "../models/travelStory.model.js";
import errorHandler from "../utils/errors.js";
import path from 'path'
import fs from 'fs'

export const addTravelStory = async(req ,res ,next) => {
    const {title ,story ,visitedLocation ,imageUrl ,visitedDate} = req.body;

    const userId = req.user.id;
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return next(errorHandler(400 ,"All Fields are required"))
    }

    //visitedDate will be in millisec so we need to convert it
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = new TravelStory({
            title,story,visitedLocation,userId,imageUrl,
            visitedDate:parsedVisitedDate,
        })

        await travelStory.save();

        res.status(200).json({
            story : travelStory,
            message:"Your story is added successfully!"
        })
    }
    catch(err) {
        next(errorHandler(err))
    }
}

export const getAllTravelStory = async(req ,res ,next) => {
    const userId = req.user.id;

    try {
        const travelStories = await TravelStory.find({userId:userId}).
        sort({
            ifFavorite:-1,
        })
        res.status(200).json({
            stories : travelStories
        })
    }
    catch(error) {
        next(error);
    }
}

export const imageUpload = async(req ,res ,next) => {
    try {
        if(!req.file){
            return next(errorHandler(400 ,"No image uploaded"))
        }

        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`
        res.status(201).json({imageUrl})
    }
    catch(error){
        return next(error);
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname,"..");

export const deleteImage = async(req ,res ,next) => {
    const {imageUrl} = req.query;

    if(!imageUrl) {
        return next(errorHandler(400 ,"ImageUrl is required!"));
    }

    try {
        const filename = path.basename(imageUrl)

        //delete the file path
        const filePath = path.join(rootDir ,"uploads" ,filename);
        
        if(!fs.existsSync(filePath)){
            return next(errorHandler(404,"Image not found"));
        }

        //delete the file
        await fs.promises.unlink(filePath);
        res.status(200).json({
            message:"Image deleted Successfully"
        })
    }
    catch(error) {
        next(error)
    }
}

export const editTravelStory = async(req ,res ,next) => {
    const {id} = req.params;
    const {title,story,visitedLocation,imageUrl,visitedDate} = req.body
    const userId = req.user.id

    //validating required field
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return next(errorHandler(400 ,"All Fields are required"))
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate))

    try {
        const travelStory = await TravelStory.findOne({_id:id ,userId:userId})

        if(!travelStory) {
            return next(errorHandler(404 ,"Travel Story not found!"))
        }

        const placeholderImgUrl = `http://localhost:3000/assets/place.jpg`

        travelStory.title = title 
        travelStory.story = story
        travelStory.visitedLocation = visitedLocation
        travelStory.imageUrl = imageUrl || placeholderImgUrl
        travelStory.visitedDate = parsedVisitedDate

        await travelStory.save();

        res.status(200).json({
            story:travelStory,
            message:"Travel Story edited successfully"
        })
    }
    catch(error) {
        next(error);
    }
}

export const deleteTravelStory = async(req ,res ,next) => {
    const {id} = req.params;
    const userId = req.user.id;

    try {
        const travelStory = await TravelStory.findOne({_id : id ,userId:userId})

        if(!travelStory) {
            next(errorHandler(404 ,"Travel Story not found!"))
        }
        await travelStory.deleteOne({_id:id ,userId:userId})

        const imageUrl = travelStory.imageUrl
        const filename = path.basename(imageUrl)

        const filePath = path.join(rootDir ,"uploads" ,filename)
        //check if file path exists

        if(!fs.existsSync(filePath)) {
            return next(errorHandler(404 ,"Image not found!"))
        }

        await fs.promises.unlink(filePath);
        res.status(200).json({
            message:"Travel Story deleted Successfully!"
        })
    }
    catch(err) {
        next(err);
    }
}

export const updateIsFavorite = async(req ,res ,next) => {
    const {id} = req.params;
    const {isFavorite} = req.body;

    const userId = req.user.id;

    try {
        const travelStory = await TravelStory.findOne({_id:id ,userId})

        if(!travelStory){
            return next(errorHandler(404 ,"Travel Story not found!"));
        }
        travelStory.isFavorite = isFavorite;

        await travelStory.save();
        res.status(200).json({
            story:travelStory,
            message:"Updated successfully!"
        })
    }
    catch(err) {
        next(err);
    }
}

export const searchTravelStory = async(req ,res ,next) => {
    const {query} = req.query
    const userId = req.user.id

    if(!query) {
        return next(errorHandler(400 ,"Query is required!"));
    }

    try {
        const searchResult = await TravelStory.find({
            userId,
            $or: [
                {title:{$regex: query ,$options: "i"}},
                {story:{$regex: query ,$options: "i"}},
                {visitedLocation:{$regex: query ,$options: "i"}}
            ]
        }).sort({isFavorite: -1})

        res.status(200).json({
            stories:searchResult
        })
    }
    catch(err) {
        next(err)
    }
}

export const filterTravelStories = async(req ,res ,next) => {
    const {startDate ,endDate} = req.query;
    const userId = req.user.id

    try {
        const start = new Date(parseInt(startDate))
        const end = new Date(parseInt(endDate))

        const filteredStories = await TravelStory.find({
            userId,
            visitedDate:{$gt:start ,$lt: end}
        }).sort({isFavorite: -1})

        res.status(200).json({
            stories:filteredStories
        })
    }
    catch(err) {
        next(err)
    }
}