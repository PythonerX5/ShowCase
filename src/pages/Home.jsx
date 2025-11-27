import React, { useEffect } from 'react'
import SeriesCard from '../components/SeriesCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMultipleSeries } from '../store/SeriesSlice';

function Home() {
  const dispatch = useDispatch();
  const { seriesList, status } = useSelector((state) => state.series);

  const diziler = [
    "Breaking Bad", "Prison Break", "Game of Thrones", "Chernobyl",
    "Black Mirror", "Anne With an E", "The Sopranos", "The Wire",
    "Succession", "Severance", "Fleabag", "Mindhunter",
    "The Mandalorian", "Peaky Blinders", "Dark", "Sherlock",
    "Money Heist (La Casa de Papel)", "Stranger Things", "The Crown",
    "Westworld", "Ozark", "Better Call Saul"
  ]

  useEffect(() => {
    if(status === 'idle') {
      dispatch(fetchMultipleSeries(diziler))
    }
  }, [dispatch, status]);

  return (
    <div className='bg-[#121212] min-h-screen'>
      
      {status === 'loading' && <div className='flex items-center justify-center w-full h-screen text-white'>Veriler çekiliyor...</div>}
      
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-8 xl:grid-cols-8 gap-4 md:gap-4 p-4 md:p-12'>
        
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