import TravelStory from "../models/travelStory.model.js";
import errorHandler from "../utils/errors.js";

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