import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'
import axios, { all } from 'axios'
import TravelStoryCard from '../../components/TravelStoryCard'
import { ToastContainer, toast } from 'react-toastify'
import {IoMdAdd} from 'react-icons/io'
import Modal from 'react-modal'
import AddEditTravelStory from '../../components/AddEditTravelStory'
import { data } from 'react-router-dom'
import ViewTravelStory from './ViewTravelStory'
import EmptyCard from '../../components/EmptyCard'
import { DayPicker } from 'react-day-picker'
import moment from 'moment'
import FilterInfoTitle from '../../components/FilterInfoTitle'
import { getEmptyCardMessage } from '../../utils/helper'

const Home = () => {
  const [allStories, setAllStories] = useState([]);
  const [searchQuery ,setSearchQuery] = useState("");
  const [filterType ,setFilterType] = useState("");

  const [dateRange ,setDateRange] = useState({from: null ,to: null})
  console.log(allStories);

  const [openAddEditModal ,setOpenAddEditModal] = useState({
    isShown : false,
    type: "add",
    data: null
  })

  const [openViewModal ,setOpenViewModal] = useState({
    isShown: false,
    data: null
  })

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

  const deleteTravelStory = async (data) => {
    const storyId = data._id

    try {
      const response = await axiosInstance.delete("/travel-story/delete-story/" + storyId)

      if(response.data && !response.data.error) {
        toast.success("Story deleted successfully!")

        setOpenViewModal((prevState) => ({...prevState ,isShown: false}))

        getAllTravelStories()
      }
    }
    catch(error) {
      console.log("Something went wrong. Please try again!")
    }
  } 

  //search story
  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  }

  const onSearchStory = async (query) => {
    try{
      const response = await axiosInstance.get('/travel-story/search' ,{
        params: {
          query
        }
      })

      if(response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllTravelStories()

    return () => { }
  }, [])

  //handle edit story
  const handleEdit = async (data) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data
    })
  }

  const handleViewStory = (data) => {
    setOpenViewModal({isShown:true ,data})
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

  //to handle date picker
  const handleDayClick = (day) => {
    setDateRange(day)
    filerStoriesByDate(day)
  }

  //handle filter story by range
  const filerStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null
      const endDate = day.to ? moment(day.to).valueOf() : null

      if(startDate && endDate) {
        const response = await axiosInstance.get("/travel-story/filter" ,{
          params:{
            startDate ,
            endDate 
          }
        })

        if(response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    }
    catch(error) {
      console.log("Something is wrong!")
    }
  }

  const resetFilter = () => {
    setDateRange({
      from: null ,
      get: null
    })

    setFilterType("");
    getAllTravelStories();
  }

  return <>
    <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearchNote={onSearchStory} handleClearSearch={handleClearSearch}/>

    <div className="container mx-auto py-10">
      <FilterInfoTitle filterType={filterType} filterDate={dateRange} onClear={() => resetFilter()}/>

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
            <EmptyCard imgSrc={"https://images.pexels.com/photos/5706021/pexels-photo-5706021.jpeg"}
                       message={getEmptyCardMessage(filterType)}
                       setOpenAddEditModal={() =>
                         setOpenAddEditModal({
                          isShown: true,
                          type:"add",
                          data:null
                         })
                       }
            />
          )}
        </div>

        <div className='w-[320px]'>
          <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'>
            <DayPicker captionLayout='dropdown' mode='range' selected={dateRange} onSelect={handleDayClick} pagedNavigation className='text-sm'/>
          </div>
        </div>
      </div>
    </div>
      
    
    {/* Add and edit travel story model */}
    <Modal isOpen={openAddEditModal.isShown} 
    onRequestClose={() => {}} 
    style={{
      overlay:{
        backgroundColor:"rgba(0,0,0,0.2)",
        zIndex:999
      },
    }} 
    appElement={document.getElementById("root")} 
    className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5
          overflow-y-scroll scrollbar z-50">
      <AddEditTravelStory 
        storyInfo={openAddEditModal.data} 
        type={openAddEditModal.type} 
        onClose={() => {
          setOpenAddEditModal({isShown:false ,type:'add' ,data:null})
        }}
        getAllTravelStories = {getAllTravelStories}
        />
    </Modal>
    
    {/* View travel story Modal */}
    <Modal isOpen={openViewModal.isShown} 
    onRequestClose={() => {}} 
    style={{
      overlay:{
        backgroundColor:"rgba(0,0,0,0.2)",
        zIndex:999
      },
    }}
    appElement={document.getElementById("root")} 
    className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5
          overflow-y-scroll scrollbar z-50">
      <ViewTravelStory 
        storyInfo={openViewModal.data}
        onClose={() => {
          setOpenViewModal((prevState) => ({...prevState ,isShown: false}))
        }}
        onEditClick={() => {
          setOpenViewModal((prevState) => ({...prevState ,isShown: false}))
          handleEdit(openViewModal.data || null);
        }}
        onDeleteClick={() => {
          deleteTravelStory(openViewModal.data || null)
        }}
      />
    </Modal>

    <button className='w-16 h-16 flex items-center justify-center rounded-full bg-[#05b6d3] hover:bg-cyan-400 fixed right-10 bottom-10 cursor-pointer' onClick={() => {
      setOpenAddEditModal({isShown: true ,type: "add" ,data:null})
    }}>
      <IoMdAdd className='text-[32px] text-white'/>
    </button>
    <ToastContainer />
  </>
}

export default Home
