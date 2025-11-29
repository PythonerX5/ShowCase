import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import SeriesCard from '../components/SeriesCard';
import { FaHeartBroken } from 'react-icons/fa';

export default function Watchlist() {
  const { user } = useSelector((state) => state.auth);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Kullanıcının 'favorites' koleksiyonunu tarihe göre çek
      const q = query(collection(db, "users", user.uid, "favorites"), orderBy("addedAt", "desc"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const favs = snapshot.docs.map(doc => doc.data());
        setFavorites(favs);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="bg-[#121212] min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
         İzleme Listem  <span className="text-lg bg-[#2a2a2a] px-3 py-1 rounded-full text-gray-400">{favorites.length}</span>
      </h1>

      {loading && <div className="text-center">Yükleniyor...</div>}

      {!loading && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <FaHeartBroken className="text-6xl mb-4 opacity-50"/>
            <p className="text-xl">Listeniz bomboş.</p>
            <p className="text-sm">Beğendiğiniz dizilerin sağ üstündeki kalp butonuna basarak ekleyebilirsiniz.</p>
        </div>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 md:gap-4">
        {favorites.map((item) => (
          <SeriesCard 
            key={item.id}
            data={{
              id: item.id,
              title: item.title,
              image: item.image,
              description: "" 
            }}
          />
        ))}
      </div>
    </div>
  );
}