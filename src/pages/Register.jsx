import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Login from './Login'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../store/authSlice'

//firebase fonksiyonları
import {auth, db} from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {doc, setDoc} from 'firebase/firestore'

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(()=>{
    if(user)
    {
      navigate('/');
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      //firebase auth ile kullanıcı oluşturma
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      //Kullanıcı profiline isim ekleme
      await updateProfile(user, {
        displayName: name
      });

      //veritabanına kullanıcıyı kaydet
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: name,
        email: email,
        role: "user",
        createdAt: new Date()
      });

      //Reduxa kaydetme
      dispatch(setUser({
        uid: user.uid,
        email: email,
        displayName: name
      }));

      //anasayfaya yonlendirme
      navigate('/');

    }
    catch(err){
      console.log(err);
      //firebase hata kodlarını türkçeleştirme(hataları daha iyi anlayabilmek icin)
      if(err.code === 'auth/email-already-in-use'){
        setError("Bu email Adresi Zaten Kullanımda");
      }
      else if(err.code === 'auth/weak-password')
      {
        setError('Şifre en az 6 karakter olmalıdır');
      }
      else
      {
        setError('Bilinmeyen bir hata oluştu: ' + err.message);
      }
    }
  };


  return (
    <div className="min-h-screen flex justify-center items-center bg-[#121212] text-white font-[Poppins]">
      <div className="bg-[#1e1e1e] p-[40px_30px] rounded-xl shadow-xl w-full max-w-[400px] text-center">
        <h2 className="text-2xl font-semibold mb-6">Kayıt Ol</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form
         className="flex flex-col items-center w-full"
         onSubmit={handleRegister}
         >
          <input
          type="text"
          name="username"
          placeholder="Kullanıcı Adı"
          onChange={(e) => setName(e.target.value)}
          required
          className="w-[90%] p-[14px_15px] my-2 rounded-lg bg-[#2a2a2a] text-white text-sm placeholder-[#aaa] outline-none border-none"
          />
          <input
          type="email"
          name="email"
          placeholder="E-posta"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-[90%] p-[14px_15px] my-2 rounded-lg bg-[#2a2a2a] text-white text-sm placeholder-[#aaa] outline-none border-none"
          />
          <input
          type="password"
          name="password"
          placeholder="Şifre"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-[90%] p-[14px_15px] my-2 rounded-lg bg-[#2a2a2a] text-white text-sm placeholder-[#aaa] outline-none border-none"
          />

          <button
          type="submit"
          className="w-full p-3 mt-4 rounded-lg bg-[#ff5252] text-white text-lg cursor-pointer transition hover:bg-[#ff7979]"
          >
            Kayıt Ol
          </button>
        </form>
        <Link to="/login" className="mt-4 block text-sm text-[#aaa] hover:text-white">
          Zaten hesabın var mı? Giriş yap
        </Link>
      </div>
    </div>
  )
}

export default Register
