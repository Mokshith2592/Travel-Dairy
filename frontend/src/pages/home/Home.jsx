import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'
import axios, { all } from 'axios'
import TravelStoryCard from '../../components/TravelStoryCard'
import { ToastContainer, toast } from 'react-toastify'

const Home = () => {
  const [allStories, setAllStories] = useState([]);
  console.log(allStories);

  //get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/travel-story/get-all")

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    }
    catch (error) {
      console.log("Something went Wrong")
    }
  }

  useEffect(() => {
    getAllTravelStories()

    return () => { }
  }, [])

  //handle edit story
  const handleEdit = async (data) => {

  }

  const handleViewStory = (data) => {

  }

  const updateIsFavorite = async (storyData) => {
    const storyId = storyData._id;
    const newFavoriteStory = !storyData.isFavorite;

    try {
      const response = await axiosInstance.put(`/travel-story/update-is-favorite/${storyId}`, {
        isFavorite: newFavoriteStory,
      })

      console.log(response);
      if (response.data && response.data.story) {
        toast.success("Story updated successfully!")
        getAllTravelStories();
      }
    }
    catch (err) {
      console.log("Failed to update favorite:", err);
    }
  }

  return <>
    <Navbar />

    <div className="container mx-auto py-10">
      <div className="flex gap-7">
        <div className='flex-1'>
          {allStories.length > 0 ? (
            <div className='grid grid-cols-2 gap-4'>
              {allStories.map((item) => {
                return <TravelStoryCard key={item._id} imageUrl={item.imageUrl} title={item.title}
                  story={item.story} date={item.visitedDate} visitedLocation={item.visitedLocation} isFavorite={item.isFavorite}

                  onEdit={() => handleEdit(item)}
                  onClick={() => handleViewStory(item)}
                  onFavoriteClick={() => updateIsFavorite(item)}
                />
              })}
            </div>
          ) : (
            <div>Empty Card Here</div>
          )}
        </div>

        <div className='w-[320px]'></div>
      </div>
    </div>

    <ToastContainer />
  </>
}

export default Home
