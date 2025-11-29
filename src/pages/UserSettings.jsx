import React, { useEffect, useState } from 'react'
import { IoMdClose, IoMdSave, IoMdSettings } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';

//Güncellemeler icin bildirimler
import toast from 'react-hot-toast';

//reduxtan güncellemeler
import { setUser } from '../store/authSlice'

//firebaseden güncelleme yapmak icin import
import { auth, db} from '../firebase'
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

function UserSettings() {
    //reduxtan kullanıcı bilgileri alındı
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    //Duzenleme modu kontrol
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //form verilerini tutacak state
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    //düzenleme iptal edilince reduxtaki ve firebasedeki eski verilere dönsün
    useEffect(() => {
        if(isEditing && user)
        {
            setFormData({
                displayName: user.displayName || '',
                email: user.email || '',
                password: '',
                confirmPassword: ''
            })
        }
    },[isEditing, user])

    //sayfa açıldığında user verilerini doldur
    useEffect(() => {
        if(user)
        {
            setFormData({
                displayName: user.displayName || '',
                email: user.email || '',
                password: '',
                confirmPassword: ''
            });
        }
    },[user]);


    //input değişikliklerini yakalama veritabanına kaydetme
    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            //isim değişikliği kontrolü
            if(formData.displayName !== user.displayName)
            {
                //auth profilini güncelleme
                await updateProfile(auth.currentUser, {
                    displayName: formData.displayName
                });
                
                //firestore veritabanınında güncelleme işlemleri
                const useRef = doc(db, "users", user.uid);
                await updateDoc(useRef, {
                    username: formData.displayName
                });

                //anlık değişimi görmek için reduxta güncelleme
                dispatch(setUser({ ...user, displayName:formData.displayName }));
            }

            //şifre değişikliği(kontrolsüz olduğu için güvenlik açıklarına müsait)
            if(formData.password)
            {
                if(formData.password.length < 6)
                {
                    throw new Error("Şifre En Az 6 karakter olamlıdır");
                }
                if(formData.password !== formData.confirmPassword)
                {
                    throw new Error('Şifreler Eşleşmiyor')
                }

                //firebase şifre güncelleme
                await updatePassword(auth.currentUser, formData.password);
                toast.success('Şifreniz başarıyla güncellendi')
            }
            toast.success("Profil Bilgileriniz başarıyla güncellendi");
            setIsEditing(false);
        }
        catch(error){
            console.log(error);

            //güvenlik icin uzun süre önce giriş yaptıysa sifreyi degistirmek icin tekrar giris yapsın
            if(error.code === 'auth/request-recent-login')
            {
                toast.error("Güvenlik gereği şifre değiştirmek için çıkış yapıp tekrar girmelisiniz.");
            }
            else {
                toast.error("Hata: " + error.message);
            }
            } 
            finally {
                setIsLoading(false);
            }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };


  return (
    <div className="bg-[#121212] pt-[10%] md:pt-[5%] text-white p-6 flex flex-col items-center justify-center">
      <div className="bg-[#1f1f1f] p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-800 text-center">
        <button 
            className='absolute top-4 right-4 text-gray-400 hover:text-[#ff5252] transition-all cursor-pointer duration-200 p-2 rounded-full hover:bg-[#2a2a2a]'
            onClick={() => setIsEditing(!isEditing)}
            title={isEditing ? "İptal Et" : "Profili Düzenle"}
        >
            {isEditing ? <IoMdClose className='text-2xl'/> : <IoMdSettings className='text-3xl'/> }
        </button>
        {!isEditing ? (
            <div className='flex flex-col items-center animate-in fade-in duration-300'>
                {/* avatar görünümü */}
                <div className='w-28 h-28 rounded-full bg-amber-600 from-[#ff5252] to-orange-500 flex items-center justify-center text-5xl font-bold text-white shadow-lg mb-6 border-4 border-[#1f1f1f]'>
                    {/* Kullanıcı varsa kullanıcı adının 0. indexini yani bas harfini al avatarın ortasına yok yoksa x yazdır */}
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : "X"}
                </div>
                <h1 className='text-3xl font-bold text-white mb-2 tracking-wide'>
                    {user?.displayName || "Misafir Kullanıcı"}
                </h1>
                <p className='text-gray-400 bg-[#2a2a2a] px-4 py-1 rounded-full mb-6'>
                    {user?.email}
                </p>
                <div className='w-full border-t border-gray-700 pt-6 mt-2'>
                    <div className='flex justify-between  text-gray-400 mb-2'>
                        <span>Hesap Durumu</span>
                        <span className='text-green-400'>Aktif</span>

                    </div>
                    <div className='flex justify-between text-gray-400'>
                        <span>Üyelik Yılı</span>
                        <span>2024</span>
                    </div>
                </div>
            </div>
        ) : (
            <form 
                onSubmit={handleSave} 
                className='flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-300'>
                <h1 className='text-xl font-bold text-center mb-2 text-[#ff5252]'>
                    Profili Düzenle
                </h1>
                {/* Kullanıcı adı */}
                <div className='flex flex-col gap1'>
                    <label className='text-gray-400 ml-1 pb-2'>Kullanıcı Adı</label>
                    <input 
                        required
                        placeholder='Kullanıcı Adı'
                        type="text"
                        name='displayName'
                        value={formData.displayName}
                        onChange={handleChange}
                        className='w-full bg-[#2a2a2a] text-white p-3 rounded-lg border border-transparent focus:border-[#ff5252] outline-none transition-all placeholder-gray-600'    
                    />
                </div>
                {/* Email */}
                <div className="flex flex-col gap-1">
                <label className="text-gray-400 ml-1">E-Posta</label>
                <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-[#181818] text-gray-500 p-3 rounded-lg border border-gray-800 cursor-not-allowed select-none"
                />
                </div>
                {/* Yeni Şifre */}
                <div className="flex flex-col gap-1">
                <label className="text-gray-400 ml-1">Yeni Şifre</label>
                <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••"
                    className="w-full bg-[#2a2a2a] text-white p-3 rounded-lg border border-transparent focus:border-[#ff5252] outline-none transition-all placeholder-gray-600"
                />
                </div>

                {/* Şifre Tekrar */}
                <div className="flex flex-col gap-1">
                <label className="text-gray-400 ml-1">Şifre Tekrar</label>
                <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••"
                    className="w-full bg-[#2a2a2a] text-white p-3 rounded-lg border border-transparent focus:border-[#ff5252] outline-none transition-all placeholder-gray-600"
                />
                </div>
                {/* İptal ve Kaydet Butonları */}
                <div className='flex gap-3 mt-4'>
                    <button
                        type='button'
                        onClick={() => setIsEditing(false)}
                        className="flex-1 cursor-pointer bg-transparent border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        İptal Et
                    </button>
                    <button
                        type='submit'
                        disabled={isLoading}
                        className="flex-1 cursor-pointer bg-[#ff5252] hover:bg-red-600 text-white py-3 rounded-lg transition-colors font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Kaydediliyor..." : <><IoMdSave className='text-xl' />Kaydet</>}
                    </button>

                </div>
            </form>
        )}
        
      </div>
    </div>
  )
}

export default UserSettings