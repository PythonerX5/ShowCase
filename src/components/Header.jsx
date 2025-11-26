import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoIosLogOut, IoMdMenu } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';

function Header() {
    //reduxtan güncel kullanıcıyı al
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogout = async () =>{
        try{
            //firebase sunucusundan çıkış yap
            await signOut(auth);
            navigate('/login')
        }
        catch(error){
            console.error("Çıkış yapılırken hata oluştu ", error)
        }
    }
  return (

    <header className='bg-[#1f1f1f] flex justify-between p-5 text-white'>
        <Link to='/' className='font-bold text-2xl'>ShowCase</Link>

        <div className='flex items-center'>
            <div className='relative items-center hidden md:inline-flex'> 
                {/*<CiSearch className='absolute left-6 text-xl' />
                <input 
                    type="text"
                    className=' border border-gray-300 text-white mx-4 px-6 pl-8 py-2 rounded-3xl' 
                />*/}
                <span className='flex gap-4 mr-4'>Hos Geldin, {user?.displayName || "misafir"} </span>
                <button 
                    className='bg-[#ff5252] p-2 rounded-[7px] cursor-pointer hover:bg-[#ff7979] flex'
                    onClick={handleLogout}
                >
                    <IoIosLogOut className='m-1' />
                    Cikis Yap
                </button>
            </div>
            <div className='flex items-center md:hidden text-white'>
                <button className='cursor-pointer'>
                    <IoMdMenu className='text-2xl'/>
                </button>
            </div>
        </div>
    </header>
  )
}

export default Header
