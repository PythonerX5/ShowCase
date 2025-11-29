import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';


function SeriesCard({ data }) {
    const { user } = useSelector((state) => state.auth)
    const navigate = useNavigate();

    //favori durumu state ile tutuluyor
    const [isFavorite, setIsFavorite] = useState(false);

    //veritabanı sorgusu(bu dizi kullanıcının favlarında var mı)
    useEffect(() => {
      if(user && data.id)
      {
        //user -> (uid) -> favorites -> (diziID)
        const docRef = doc(db, 'users', user.uid, 'favorites', data.id);
        //veritabanı canlı dinleme(baska sekmelerde gecikme azaltmak icin)
        const unsubscribe = onSnapshot(docRef, (doc) => {
          setIsFavorite(doc.exists());
        });
        return () => unsubscribe;
      }
    }, [user, data.id])


    const toggleFavorite = async (e) => {
      //kalbe tıklayınca detay sayfasına gitmesin sadece kalp degissin
      e.stopPropagation();

      const docRef = doc(db, 'users', user.uid, 'favorites', data.id);

      try{
        if(isFavorite)
        {
          await deleteDoc(docRef);
          toast(`${data.title} İzleme Listesinden Çıkarıldı`, {icon: '🗑️'});
        }
        else
        {
          await setDoc(docRef, {
            id: data.id,
            title: data.title,
            image: data.image || "N/A",
            addedAt: serverTimestamp()
          });
          toast.success(`${data.title} Listeye Eklendi`);
        }
      }
      catch(error)
      {
        console.log(error);
        toast.error('İşlem başarısız')
      }
    };

  return (
    <div 
         className="relative border border-gray-800 rounded-md overflow-hidden bg-[#1f1f1f] shadow-sm hover:shadow-md hover:scale-105 transition-all w-full cursor-pointer group"
         onClick={() => navigate(`/series/${data.id}`, { state: data })}>
      <button
        onClick={toggleFavorite}
        className="absolute top-2 opacity-100 right-2 z-10 p-2 rounded-full bg-black/60 hover:bg-black cursor-pointer text-white transition-all md:opacity-0 md:hover:opactiy-100 group-hover:opacity-100"
        title={isFavorite ? "Listeden Çıkar" : "Listeye Ekle"}
      >
        {isFavorite ? <FaHeart className='text-[#ff5252] text-lg'/> : <FaRegHeart className='text-white text-lg hover:text-[#ff5252]'/>}

      </button>
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
