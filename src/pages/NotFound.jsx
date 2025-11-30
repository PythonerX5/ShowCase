import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGhost } from 'react-icons/fa'; // Hayalet ikonu

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4 text-center">
      
      {/* İkon ve Efekt */}
      <div className="relative">
        <h1 className="text-[150px] font-black text-[#1f1f1f] select-none">404</h1>
        <FaGhost className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-[#ff5252] animate-bounce" />
      </div>

      <h2 className="text-3xl font-bold mb-4">Ups! Kaybolmuş gibisin. 👻</h2>
      <p className="text-gray-400 max-w-md mb-8">
        Aradığın sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
        Uzay boşluğunda süzülmek yerine ana üsse dönmeye ne dersin?
      </p>

      <button 
        onClick={() => navigate('/')}
        className="bg-[#ff5252] cursor-pointer hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-red-500/20"
      >
        Ana Sayfaya Işınlan 🚀
      </button>
      
    </div>
  );
}