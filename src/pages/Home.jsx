import React, { useEffect, useState } from 'react'
import SeriesCard from '../components/SeriesCard'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

function Home() {
  const [dbSeries, setDbSeries] = useState([]);
  const [loading, setLoading] =useState(true);

  useEffect(() => {
    //veritabanından 'series'i alalım
    const q = query(collection(db, "series"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const seriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDbSeries(seriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

 {/*
  const diziler = [
    "Breaking Bad", "Prison Break", "Game of Thrones", "Chernobyl",
    "Black Mirror", "Anne With an E", "The Sopranos", "The Wire",
    "Succession", "Severance", "Fleabag", "Mindhunter",
    "The Mandalorian", "Peaky Blinders", "Dark", "Sherlock",
    "Money Heist (La Casa de Papel)", "Stranger Things", "The Crown",
    "Westworld", "Ozark", "Better Call Saul"
  ]
*/}

  return (
    <div className='bg-[#121212] min-h-screen'>
      
      {loading === 'loading' && <div className='flex items-center justify-center w-full h-screen text-white'>Veriler çekiliyor...</div>}
      
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-8 xl:grid-cols-8 gap-4 md:gap-4 p-4 md:p-12'>
        
        {dbSeries?.map((item) => (
            <SeriesCard
              key={item.id}
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