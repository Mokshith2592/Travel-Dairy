import React from 'react'
import axiosInstance from './axiosInstance.js'

const uploadImage = async (imageFile) => {
    const formData = new FormData()

    formData.append("image" ,imageFile)
    try {
        const response = await axiosInstance.post("travel-story/image-upload" ,
            formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            }
        )
        return response.data;
    }
    catch(err) {
        console.log("Error in uploading the image" ,err)
        throw err
    }
}

export default uploadImage
