import React from 'react'
import moment from 'moment'
import {FaHeart, FaLocationDot} from 'react-icons/fa6'

const TravelStoryCard = ({imageUrl ,title ,story ,date ,visitedLocation ,isFavorite ,onEdit ,onClick ,onFavoriteClick}) => {
    return (
        <div className='border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all ease-in-out relative cursor-pointer'>
            <img src={imageUrl} alt="Img not found " className='w-full h-56 object-cover rounded-lg' onClick={onClick}/>

            <button className="w-12 h-12 flex items-center justify-center bg-white/30 rounded-lg border border-white/30 absolute top-4 right-4" onClick={onFavoriteClick}>
                <FaHeart className={`icon-btn ${isFavorite ? "text-red-500" : "text-white"} hover:text-red-500`}/>
            </button>
            
            <div className='p-4' onClick={onClick}>
                <div className='flex items-center gap-3'>
                    <div className='flex-1'>
                        <h6 className='text-[16px] font-medium'>{title}</h6>

                        <span className='text-xs text-slate-400'>
                            {date ? moment(date).format("Do MMM YYYY") : "-"}
                        </span>
                    </div>
                </div>

                <p className='text-sm text-slate-600 mt-2'>{story?.slice(0 ,60)}</p>

                <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1'>
                    <FaLocationDot className='text-sm'/>

                    {visitedLocation.map((item ,index) => 
                        visitedLocation.length === index + 1 ? `${item}` : `${item},`
                    )}
                </div>
            </div>
        </div>
    )
}

export default TravelStoryCard
