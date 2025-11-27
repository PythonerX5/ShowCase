import { FaUser } from "react-icons/fa";
import { IoIosLogOut, IoMdClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { useState } from "react";
import UserSettings from "../pages/UserSettings";

function Header() {
    // Redux'tan güncel kullanıcıyı al
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const urlUserName = user?.displayName
    ? user.displayName.replace(/\s+/g, '-').toLowerCase()
    :"Kullanici"


    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () =>{
        try{
            // Firebase sunucusundan çıkış yap
            await signOut(auth);
            setIsMenuOpen(false);
            navigate('/login')
        }
        catch(error){
            console.error("Çıkış yapılırken hata oluştu ", error)
        }
    }

    const closeMenu = () => setIsMenuOpen(false);

  return (
    // Header Kapsayıcısı
    <header className='bg-[#1f1f1f] flex justify-between px-6 py-4 text-white items-center relative z-50 shadow-md'>        
        <Link to='/' className='font-bold text-2xl tracking-wider hover:opacity-80 transition-opacity'>
            <span className='text-[#ff5252]'>Show</span>Case
        </Link>
        <div className='flex items-center text-white'>
            <button 
                className='cursor-pointer p-2 hover:bg-[#333] rounded-full transition-colors'
                onClick={() => setIsMenuOpen(!isMenuOpen)}    
            >
                {isMenuOpen ? <IoMdClose className="text-2xl"/> : <FaUser className='text-xl'/>}
            </button>
        </div>
        {isMenuOpen && (
                <div className="absolute top-16 right-4 w-64 bg-[#2a2a2a] border border-gray-700 rounded-lg flex flex-col items-center py-5 gap-4 shadow-2xl animate-in fade-in slide-in-from-top-2">                    
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-[#2a2a2a] border-t border-l border-gray-700 transform rotate-45"></div>
                    {user ? (
                        <>
                            <div className="text-center px-4 w-full">
                                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Hesap</p>
                                <p className="font-bold text-white truncate">{user.displayName || user.email}</p>
                            </div>
                            <hr className="w-3/4 border-gray-600" />
                            <Link 
                                to={`/user/${urlUserName}`} 
                                onClick={closeMenu} 
                                className="w-full text-center py-2 hover:bg-[#333] hover:text-[#ff5252] transition-colors"
                            >
                                Hesap ayarları
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className='bg-[#ff5252] cursor-pointer   hover:bg-red-600 text-white w-3/4 py-2 rounded-md flex justify-center items-center gap-2 font-bold transition-colors shadow-md'
                            >
                                <IoIosLogOut className='text-xl' />
                                Çıkış Yap
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-400 text-sm">Hesabın yok mu?</p>
                            <Link 
                                to="/login" 
                                onClick={closeMenu} 
                                className="w-3/4 text-center border border-[#ff5252] text-[#ff5252] py-2 rounded-md hover:bg-[#ff5252] hover:text-white transition-all font-bold"
                            >
                                Giriş Yap
                            </Link>
                            <Link 
                                to="/register" 
                                onClick={closeMenu} 
                                className="w-3/4 text-center bg-[#ff5252] text-white py-2 rounded-md hover:bg-[#ff7979] transition-all font-bold shadow-md"
                            >
                                Kayıt Ol
                            </Link>
                        </>
                    )}
                </div>
        )}
    </header>
  )
}

export default Header