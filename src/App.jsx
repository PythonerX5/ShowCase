import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoutes from "./routes/PrivateRoutes";
import SeriesDetail from "./pages/SeriesDetail";
import Header from "./components/Header";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logoutUser, setUser } from "./store/authSlice";
import { Toaster } from "react-hot-toast";
import UserSettings from "./pages/UserSettings";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import AdminPage from "./pages/AdminPage";

function App() {
  const dispatch = useDispatch();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    //kullanıcı durumu değişikliği sorgulama
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user)
      {
        //giriş yapmış kullanıcının rolünü soralım
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: userData.role || 'user'
        }));
      }
      else
      {
        //kullanıcı çıkış yapmış
        dispatch(logoutUser());
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, [dispatch]);
  
  if(isAuthChecking){
    return (
          <div className="h-screen bg-[#121212] flex items-center justify-center text-white">
            {/* Basit bir yükleniyor animasyonu */}
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff5252]"></div>
              <span className="text-gray-400 text-sm">Sunucuya bağlanılıyor...</span>
            </div>
          </div>
        );
  }
  return (
    <>
      <Toaster position="top-center"/>
      <Routes>
        <Route path="/admin/:username" element={
          <PrivateRoutes>
            <Header />
            <AdminPage />
          </PrivateRoutes>
        }/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={
          <PrivateRoutes>
            <Header/>
            <Home/>
          </PrivateRoutes>
          }/>
          <Route path="/series/:id" element={
            <PrivateRoutes>
              <Header />
              <SeriesDetail />
            </PrivateRoutes>
          }/>
          <Route
            path="/user/:username"
            element={
              <PrivateRoutes>
                <Header/>
                <UserSettings/>
              </PrivateRoutes>
            }
          />
      </Routes>
    </>
  )
}

export default App
