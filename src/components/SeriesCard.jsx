import React from 'react'
import { useNavigate } from 'react-router-dom'

function SeriesCard({ data }) {

    const navigate = useNavigate();
  return (
    <div className='bg-[#1e1e1e] rounded-[10px] overflow-hidden transition-all hover:translate-y-1.5 w-52 h-[450px] text-white'>
      <img
        src={data.image}
        className='w-full h-[270px] object-cover p-1 rounded-[10px] '
      />
      <div>
        <h3 className='text-white font-bold p-3 text-xl flex justify-center'>{data.title}</h3>
        <p className='line-clamp-2 text-sm p-2 h-10'>
            {data.description}
        </p>
        <button 
            className='w-20 bg-[#ff5252] mx-4 my-6 p-2 rounded-[10px] cursor-pointer '
            onClick={() => navigate(`/series/${data.id}`)}
        >
            detaylar
        </button>
      </div>
    </div>
  )
}

export default SeriesCard
