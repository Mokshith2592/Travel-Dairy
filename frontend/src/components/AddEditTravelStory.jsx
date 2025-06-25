import React, { useState } from 'react'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import {MdOutlineDeleteOutline, MdOutlineUpdate} from 'react-icons/md'
import DateSelector from './DateSelector'
import ImageSelector from './ImageSelector'
import TagInput from './TagInput'
import axiosInstance from '../utils/axiosInstance'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import uploadImage from '../utils/uploadImage'

const AddEditTravelStory = ({storyInfo ,type ,onClose ,getAllTravelStories}) => {
    const [visitedDate ,setVisitedDate] = useState(null)
    const [title ,setTitle] = useState("");
    const [storyImg ,setStoryImg] = useState(null);
    const [story ,setStory] = useState("");
    const [visitedLocation ,setVisitedLocation] = useState([]);

    const [error ,setError] = useState("");

    const addNewTravelStory = async () => {
        try {
            let imageUrl = "";
            //Upload img if present

            if(storyImg) {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || ""
            }
            const response = await axiosInstance.post("/travel-story/add", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
                visitedLocation
            })

            if(response.data && response.data.story) {
                toast.success("Story added successfully!")

                getAllTravelStories()
                onClose()
            }

        }
        catch(error) {
            console.log(error)
        }
    }
    const updateTravelStory = async () => {

    }

    const handleDeleteStoryImage = () => {
    }
    
    const handleAddOrUpdateClick = () => {
        if(!title) {
            setError("Please enter the title");
        }
        if(!story) {
            setError("Please enter the story");
        }
        
        setError("");
        if(type === "edit") {
            updateTravelStory();
        }
        else {
            addNewTravelStory();
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h5 className='text-xl font-medium text-slate-700'>
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>

                <div>
                    <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                        {type === "add" ? (
                            <button className='btn-small cursor-pointer transition duration-300' onClick={handleAddOrUpdateClick}>
                                <IoMdAdd className='text-lg' />ADD STORY
                            </button>
                        ) : (
                            <>
                                <button className='btn-small cursor-pointer' onClick={handleAddOrUpdateClick}><MdOutlineUpdate className='text-lg'/> UPDATE STORY</button>
                                <button className='btn-small cursor-pointer btn-delete'><MdOutlineDeleteOutline className='text-lg'/>DELETE STORY</button>
                            </>                            
                        )}

                        <button className='' onClick={onClose}>
                            <IoMdClose className='text-xl text-slate-400 cursor-pointer hover:text-red-500'/>
                        </button>
                    </div>

                    {error && (
                        <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
                    )}
                </div>
            </div>

            <div className='flex flex-1 flex-col gap-2 pt-4'>
                <label className='input-label'>TITLE</label>

                <input type="text" className='text-2xl text-slate-900 outline-none' 
                    placeholder='Once Upon a Time...' value={title} onChange={(e) => setTitle(e.target.value)}/>
                
                <div className='my-3'>
                    <DateSelector date={visitedDate} setDate={setVisitedDate}/>
                </div>
                
                <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImage={handleDeleteStoryImage}/>

                <div className='flex flex-col gap-2 mt-4'>
                    <label className='input-label'>STORY</label>
                    <textarea type="text" className='text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded-sm' placeholder='Your Story' rows={10} value={story} onChange={(e) => setStory(e.target.value)} />
                </div>

                <div className='pt-3'>
                    <label className='input-label'>VISITED LOCATIONS</label>
                    <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default AddEditTravelStory
