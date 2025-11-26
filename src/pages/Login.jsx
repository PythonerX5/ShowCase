import { Link, useNavigate } from "react-router-dom"
import Register from "./Register"
import Home from "./Home"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../store/authSlice"
import { useEffect, useState } from "react"
//firebase
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(()=>{
    if(user)
    {
      navigate('/')
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try{
      //firebase ile giriş
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //redux güncelle
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));

      //yönlendirme
      navigate('/');

    }
    catch(err){
      console.log(err);
      if(err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password')
      {
        setError('Email veya şifre hatalı')
      }
      else
      {
        setError('Giriş başarısız. Lütfen tekrar deneyiniz')
      }
    }
  };

    return (
     <div className="min-h-screen flex justify-center items-center bg-[#121212] text-white font-[Poppins]">
      <div className="bg-[#1e1e1e] p-[40px_30px] rounded-xl shadow-xl w-full max-w-[400px] text-center">
        <form className="flex flex-col items-center w-full" onSubmit={handleLogin}>
          <h2 className="text-2xl font-semibold mb-6">Giriş Yap</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="text"
            name="login"
            placeholder="E-posta veya Kullanıcı Adı"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-[90%] p-3 my-2 rounded-lg bg-[#2a2a2a] text-white text-sm placeholder-[#aaa] outline-none border-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            required
            className="w-[90%] p-3 my-2 rounded-lg bg-[#2a2a2a] text-white text-sm placeholder-[#aaa] outline-none border-none"
            onChange={(e) => setPassword(e.target.value)}
          />
            <button
              type="submit"
              className="w-[90%] p-3 mt-4 rounded-lg bg-[#f70000] text-white text-lg cursor-pointer transition hover:bg-[#ff7979]"
            >
              Giriş Yap
            </button>
        </form>
        <p></p>
        <Link
          to="/register"
          className="mt-4 block text-sm text-[#aaa] hover:text-white"
        >
          Henüz hesabın yok mu? Kayıt ol
        </Link>
      </div>

    </div>
  )
}

export default Login
