import React, { useEffect } from 'react'
import Header from '../components/Header'
import SeriesCard from '../components/SeriesCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMultipleSeries } from '../store/SeriesSlice';

function Home() {
  const dispatch = useDispatch();
  const { seriesList, status } = useSelector((state) => state.series);

  const diziler = [
    "Breaking Bad", 
    "Prison Break", 
    "Game of Thrones", 
    "Chernobyl",
    "Black Mirror",
    "Anne With an E",
    "The Sopranos",
    "The Wire",
    "Succession",
    "Severance",
    "Fleabag",
    "Mindhunter",
    "The Mandalorian",
    "Peaky Blinders",
    "Dark",
    "Sherlock",
    "Money Heist (La Casa de Papel)",
    "Stranger Things",
    "The Crown",
    "Westworld",
    "Ozark",
    "Better Call Saul"
  ]

  useEffect(() => {
    if(status  === 'idle')
    {
      dispatch(fetchMultipleSeries(diziler))
    }

  }, [dispatch, status]);
  return (
    <div className=''>
      {status === 'loading' && <div className='flex items-center justify-center w-full h-full'>Veriler çekiliyor...</div>}
      <div className='bg-[#121212] gap-20 p-12 grid grid-cols-7'>
        {seriesList?.map((item) => (
            <SeriesCard
              key={item.imdbID}
              data={{
                id: item.imdbID,
                title: item.Title,
                image: item.Poster,
                description: item.Plot
              }}
            />
        ))}
      </div>
    </div>
  )
}

export default Home
