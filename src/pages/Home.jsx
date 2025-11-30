import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Yeni Bileşenler
import HeroSlider from '../components/HeroSlider';
import SeriesRow from '../components/SeriesRow';
import { FaSpinner } from 'react-icons/fa';

function Home() {
  const { user } = useSelector((state) => state.auth);
  
  const [dbSeries, setDbSeries] = useState([]); //tüm diziler
  const [userFavorites, setUserFavorites] = useState([]); 
  const [loading, setLoading] = useState(true);

  //tüm dizileri çekelim
  useEffect(() => {
    const q = query(collection(db, "series"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDbSeries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  //kullanıcı favorileri
  useEffect(() => {
    if (user) {
      const qFav = query(collection(db, "users", user.uid, "favorites"), orderBy("addedAt", "desc"));
      const unsubFav = onSnapshot(qFav, (snapshot) => {
        const favs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserFavorites(favs);
      });
      return () => unsubFav();
    } else {
        setUserFavorites([]);
    }
  }, [user]);

  if (loading) {
      return (
        <div className='flex flex-col items-center justify-center w-full h-screen bg-[#121212] text-white'>
            <FaSpinner className="animate-spin text-4xl text-[#ff5252] mb-4"/>
            <p>Diziler Yükleniyor...</p>
        </div>
      );
  }

  return (
    <div className='bg-[#121212] min-h-screen pb-20'>
      {dbSeries.length > 0 && <HeroSlider series={dbSeries} />}
      <div className="-mt-20 relative z-20 space-y-8">
        {user && userFavorites.length > 0 && (
            <SeriesRow title={`Senin Listen (${user.displayName || 'Kullanıcı'})`} series={userFavorites} />
        )}
        <SeriesRow title="Platformda Yeni" series={dbSeries} />
        {dbSeries.length > 5 && (
            <SeriesRow title="Gözden Kaçırma" series={[...dbSeries].reverse()} />
        )}

      </div>
    </div>
  )
}

export default Home;