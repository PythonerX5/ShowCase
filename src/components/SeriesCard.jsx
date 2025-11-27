import React from 'react'
import { useNavigate } from 'react-router-dom'

function SeriesCard({ data }) {

    const navigate = useNavigate();
  return (
    <div className='bg-[#1e1e1e] rounded-[10px] overflow-hidden transition-all hover:translate-y-1.5 ld:w-52 lg:h-[450px] text-white'>
      <img
        src={data.image}
        className='w-full h-[270px] group-hover:opacity-80 object-cover p-1 rounded-[10px] '
      />
      <div>
        <h3 className='text-white font-bold p-3 text-sm truncate flex justify-center'>{data.title}</h3>
        <p className='line-clamp-5 h-12 px-3 '>
            {data.description}
        </p>
        <button 
            className='w-20 bg-[#ff5252] flex items-center justify-center my-6 mx-4 p-2 rounded-[10px] cursor-pointer '
            onClick={() => navigate(`/series/${data.id}`)}
        >
            detaylar
        </button>
      </div>
    </div>
  )
}

export default SeriesCard
