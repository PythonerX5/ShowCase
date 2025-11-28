import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FaTrash, FaPlus, FaSpinner, FaUserSlash } from 'react-icons/fa';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // State'ler
  const [seriesName, setSeriesName] = useState("");
  const [users, setUsers] = useState([]);
  const [dbSeries, setDbSeries] = useState([]); // Veritabanındaki diziler (Silmek için)
  const [activeTab, setActiveTab] = useState("series");
  
  // Yüklenme Durumları
  const [addingLoading, setAddingLoading] = useState(false); //dizi eklerken dönen loading

  useEffect(() => {
    //admin kontrolü
    if (user && user.role !== 'admin') {
      toast.error("Yetkisiz Giriş!");
      navigate('/');
    }

    //kullanıcıları anlık alma
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Dizileri Canlı Dinle (Listelemek ve Silmek için)
    const qSeries = query(collection(db, "series"), orderBy("createdAt", "desc"));
    const unsubSeries = onSnapshot(qSeries, (snapshot) => {
      setDbSeries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Temizlik
    return () => {
      unsubUsers();
      unsubSeries();
    };
  }, [user, navigate]);


  //dizi ekleme
  const handleAddSeries = async (e) => {
    e.preventDefault();
    if (!seriesName.trim()) return;
    
    setAddingLoading(true); //butonu kilitleme

    try {
      // OMDb'den veriyi çek
      const response = await fetch(`https://www.omdbapi.com/?t=${seriesName}&type=series&apikey=${API_KEY}`);
      const data = await response.json();

      if (data.Response === "False") {
        toast.error(`Dizi bulunamadı: ${data.Error}`);
        setAddingLoading(false);
        return;
      }

      // Aynı dizi zaten var mı kontrolü
      // Firestore'a kaydet
      await addDoc(collection(db, "series"), {
        imdbID: data.imdbID,
        Title: data.Title,
        Poster: data.Poster,
        Plot: data.Plot,
        Year: data.Year,
        Actors: data.Actors || "Bilinmiyor",
        imdbRating: data.imdbRating || "N/A",
        Genre: data.Genre || "N/A",
        addedBy: user.uid,
        createdAt: serverTimestamp()
      });

      toast.success(`${data.Title} kütüphaneye eklendi!`);
      setSeriesName("");
      
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu.");
    } finally {
      setAddingLoading(false); //buton kilidi kaldırma işlemi
    }
  };

  //dizi silme
  const handleDeleteSeries = async (id, title) => {
    if(window.confirm(`"${title}" dizisini silmek istediğinize emin misiniz?`)) {
      try {
        await deleteDoc(doc(db, "series", id));
        toast.success("Dizi silindi.");
      } catch (error) {
        toast.error("Silinemedi: " + error.message);
      }
    }
  };

  //kullanıcı silme
  const handleDeleteUser = async (id) => {
    if(window.confirm("Bu kullanıcıyı silmek veritabanından kaldıracaktır. Emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        toast.success("Kullanıcı silindi.");
      } catch (error) {
        toast.error("Hata: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#ff5252] flex items-center gap-3">
           👑 Admin Paneli
        </h1>
        <div className="flex gap-4 mb-6 border-b border-gray-800 pb-1">
          <button 
            onClick={() => setActiveTab("series")}
            className={`px-4 cursor-pointer py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'series' ? 'bg-[#ff5252] text-white' : 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]'}`}
          >
            Dizi Yönetimi
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-4 cursor-pointer py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-[#ff5252] text-white' : 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]'}`}
          >
            Kullanıcı Yönetimi
          </button>
        </div>

        {/*  dizi işlemleri */}
        {activeTab === 'series' && (
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* ekleme formu */}
            <div className="md:col-span-1">
                <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-800 sticky top-4">
                    <h2 className="text-xl font-bold mb-4">Yeni Dizi Ekle</h2>
                    <form onSubmit={handleAddSeries} className="flex flex-col gap-4">
                        <input 
                            value={seriesName}
                            onChange={(e) => setSeriesName(e.target.value)}
                            placeholder="Dizi Adı (Örn: The Office)" 
                            className="bg-[#2a2a2a] p-3 rounded text-white border border-gray-700 outline-none focus:border-[#ff5252]"
                        />
                        <button 
                            type="submit" 
                            disabled={addingLoading || !seriesName} // Boşsa veya yükleniyorsa tıklanmasın
                            className="bg-[#ff5252] cursor-pointer hover:bg-red-600 py-3 rounded font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {addingLoading ? <FaSpinner className="animate-spin"/> : <FaPlus />}
                            {addingLoading ? "Ekleniyor..." : "Diziyi Ekle"}
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-4">
                        Not: Dizi eklendiğinde ana sayfada otomatik görünür.
                    </p>
                </div>
            </div>

            {/* mevcut diziler */}
            <div className="md:col-span-2">
                <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold mb-4 flex justify-between">
                        Kütüphane <span className="text-sm bg-[#2a2a2a] px-2 py-1 rounded text-gray-400">{dbSeries.length} Dizi</span>
                    </h2>
                    
                    <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {dbSeries.map(series => (
                            <div key={series.id} className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-lg group hover:bg-[#333] transition-colors">
                                <div className="flex items-center gap-4">
                                    <img src={series.Poster} alt={series.Title} className="w-10 h-14 object-cover rounded bg-gray-800"/>
                                    <div>
                                        <h4 className="font-bold">{series.Title}</h4>
                                        <span className="text-xs text-gray-400">{series.Year} • IMDB: {series.imdbRating}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteSeries(series.id, series.Title)}
                                    className="bg-red-500/10 cursor-pointer text-red-500 p-2 rounded hover:bg-red-500 hover:text-white transition-all"
                                    title="Sil"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* kullanıcı listesi */}
        {activeTab === 'users' && (
          <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-800">
             <h2 className="text-xl font-bold mb-4">Kayıtlı Kullanıcılar</h2>
             
             {users.length === 0 ? (
                 <div className="text-center py-10 bg-[#2a2a2a] rounded-lg">
                    <FaUserSlash className="text-4xl text-gray-600 mx-auto mb-3"/>
                    <p>Kullanıcı listesi boş görünüyor.</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Firestore "users" koleksiyonu boş olabilir. <br/>
                        Authentication'a kayıtlı kullanıcılar otomatik olarak buraya gelmez, kayıt olurken kodla eklenir.
                    </p>
                 </div>
             ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="text-gray-400 border-b border-gray-700 text-sm uppercase">
                         <th className="p-3">Kullanıcı</th>
                         <th className="p-3">Email</th>
                         <th className="p-3">Rol</th>
                         <th className="p-3 text-right">İşlem</th>
                       </tr>
                     </thead>
                     <tbody>
                       {users.map(u => (
                         <tr key={u.id} className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors">
                           <td className="p-3 font-bold flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                                   {u.username ? u.username.charAt(0).toUpperCase() : "?"}
                               </div>
                               {u.username || "İsimsiz"}
                           </td>
                           <td className="p-3 text-gray-400">{u.email}</td>
                           <td className="p-3">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-green-900 text-green-300'}`}>
                               {u.role || 'user'}
                             </span>
                           </td>
                           <td className="p-3 text-right">
                             {u.role !== 'admin' && (
                               <button 
                                 onClick={() => handleDeleteUser(u.id)}
                                 className="text-red-500 hover:text-red-400 cursor-pointer p-2 rounded hover:bg-red-500/10 transition-colors"
                                 title="Kullanıcıyı Sil"
                               >
                                 <FaTrash />
                               </button>
                             )}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}