import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSeriesDetail, clearSelectedSeries } from '../store/seriesSlice';
import { FaEye } from "react-icons/fa6";

//firebase cagirma
import { db } from '../firebase';
import { addDoc, collection, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

//yorum kutusu bilesenleri
const ReviewItem = ({ review }) => {
  const [isRevealed, setIsRevealed] = useState(!review.is_spoiler);

  return (
    <div className="border-b border-[#333] pb-4 last:border-none">
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-bold text-lg text-gray-200">{review.username}</span>
        <span className="text-[#ffb347] text-sm flex items-center gap-2">
          Puan: {review.rating}/10
          {review.is_spoiler && (
            <span className="text-red-500 text-xs border border-red-500 px-1 rounded font-bold">
              SPOILER
            </span>
          )}
        </span>
      </div>

      <div className="relative">
        
        <p className={`text-gray-300 whitespace-pre-wrap text-sm transition-all duration-300 ${
            !isRevealed ? 'blur-[6px] select-none opacity-50' : '' 
          }`}>
          {review.body}
        </p>

        {!isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button 
              onClick={() => setIsRevealed(true)}
              className="bg-[#ff5252] hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
            >
              <FaEye /> Spoiler'ı Göster
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SeriesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const initialData = location.state;
  const { selectedSeries } = useSelector((state) => state.series);

  //reduxtan giris yapmis kullaniciyi alma(yorumdaki isim icin)
  const { user } = useSelector((state) => state.auth);
  const displayData = selectedSeries || initialData;

  //state tanımları
  const [reviews, setReviews] = useState([]); //veritabanından gelen yorumlar
  const [comment, setComment] = useState(''); //formdaki yorum
  const [rating, setRating] = useState(''); //formdaki puan
  const [isSpoiler, setIsSpoiler] = useState(false);

  //reduxtan dizi detayını çekelim
  useEffect(() => {
    if(id) dispatch(fetchSeriesDetail(id));
    return () => dispatch(clearSelectedSeries());
  }, [dispatch, id]);

  //Yorumları canlı olarak dinleme
  useEffect(() => {
    if(id){
      // Sorgu: "comments" koleksiyonuna git, "seriesId"si şu anki dizi olanları al, tarihe göre tersten sırala
      const q = query(
        collection(db, "comments"),
        where("seriesId", "==", id),
        orderBy("createdAt", "desc")
      );

      //onSnapshot:Veritabanında değişim olduğunda çalıaşcak kod
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedReviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(fetchedReviews);
      });
      return () => unsubscribe(); //sayfadan çıkınca dinlemeyi biraksin(performans icin)
    }
  }, [id]);

  //Yorum Gönderme işlemleri
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Kullanici giris yapmis mi kontrol(İmkansız ama güvenlik icin)
    if(!user){
      alert("Yorum yapabilmek icin giriş yapmalısın!");
      navigate('/login');
      return;
    }
    if(!rating)
    {
      alert("Lütfen diziye bir puan verin!");
      return;
    }
    try{
      //firebase e kayıt işlemleri
      await addDoc(collection(db, "comments"), {
        seriesId: id, //hangi diziye ait
        userId: user.uid, //Kim yazdı
        username: user.displayName || user.email, //görünecek isim
        body: comment, //yorum metni
        rating: Number(rating), //puan
        is_spoiler: isSpoiler, //spoiler kontrol
        createdAt: serverTimestamp() //sunucu saati(sıralama icin)
      });
      
      //form temizleme
      setComment('')
      setRating('');
      setIsSpoiler(false);

      //bildirim
      toast.success("Yorumunuz başarıyla gönderildi!",{
        duration: 5000,
        position: 'top-center'
      });
   }
   catch(error){
    console.error("Yorum eklenirken hata oluştu: ", error);
    toast.error("Bir hata oluştu!");

   }
  };


  if (!displayData) return <div className="bg-[#121212] min-h-screen text-white p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="bg-[#121212] min-h-screen text-white font-sans">

      <div className="max-w-[900px] mx-auto my-10 px-4">
        <button onClick={() => navigate(-1)} className="my-5 cursor-pointer bg-[#ff5252] hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium">
          Geri
        </button>
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <img 
            src={displayData.image || displayData.Poster} 
            alt={displayData.title || displayData.Title}
            className="w-full md:w-[250px] h-[350px] object-cover rounded-xl shadow-lg bg-[#1f1f1f]" 
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 text-white">
              {displayData.title || displayData.Title} 
              <span className="text-[#ff5252] ml-2 text-2xl">({selectedSeries?.Year || "..."})</span>
            </h2>
            <div className="text-[#ccc] text-lg leading-relaxed">
              {selectedSeries ? (
                <>
                  <p className="mb-4">{selectedSeries.Plot}</p>
                  <div className="flex flex-wrap gap-2 text-sm mt-4">
                     <span className="bg-[#2a2a2a] px-3 py-1 rounded border border-[#333]">IMDb: {selectedSeries.imdbRating}</span>
                     <span className="bg-[#2a2a2a] px-3 py-1 rounded border border-[#333]">Oyuncular: {selectedSeries.Actors}</span>
                  </div>
                </>
              ) : (
                <div className="animate-pulse space-y-3">
                   <p>{displayData.description}</p>
                   <div className="h-4 bg-[#2a2a2a] rounded w-3/4"></div>
                   <span className="text-sm text-gray-500 block mt-2">Detaylar yükleniyor...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold border-b border-[#333] pb-2 mb-4">Yorumlar</h3>

        <div className="space-y-4">
           {reviews.length > 0 ? (
             reviews.map((r) => (
               <ReviewItem key={r.id} review={r} />
             ))
           ) : (
             <p className="text-gray-500">Henüz yorum yok.</p>
           )}
        </div>

        <div className="mt-10 bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-[#333]">
           <h3 className="text-xl font-bold mb-4">Yeni Yorum Ekle</h3>
           <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <textarea 
                placeholder="Yorumunuz..." 
                rows="4" 
                required 
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                className="w-full bg-[#2a2a2a] p-3 rounded-lg text-white border border-transparent focus:border-[#ff5252] outline-none resize-none" 
              />
              <div className="flex gap-4">
                 <select 
                  className="bg-[#2a2a2a] p-3 rounded-lg text-white outline-none flex-1 cursor-pointer"
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                >
                    <option value="">Puan Seçin</option>
                    {[...Array(10)].map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
                 </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-2 w-max select-none">
                 <input 
                  type="checkbox"
                  disabled={!user}
                  checked={isSpoiler}
                  onChange={(e) => setIsSpoiler(e.target.checked)}
                  className="accent-[#ff5252] w-4 h-4"
                />
                 <span className="text-sm text-gray-300">Spoiler içeriyor</span>
              </label>
              <button 
                type="submit" 
                className="bg-[#ff5252] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg mt-2 transition-colors cursor-pointer"
              >
                {user ? "Yorum Gönder" : "Yorum Göndermek Giriş Yapmalısın"}
              </button>
           </form>
        </div>

      </div>
    </div>
  );
}