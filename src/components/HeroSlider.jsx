import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

// swiper stillerini dahil etmek gerekiyor
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';



function HeroSlider({ series }) {
    const navigate = useNavigate();

    //sliderda gösterilecek 5 Dizi
    const featuredSeries = series.slice(0, 5);

return (
    <div className="w-full h-[500px] md:h-[600px] relative group">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        effect={'fade'} // silik geçiş efekti
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true} // Ok tuşları
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="w-full h-full"
      >
        {featuredSeries.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-full bg-[#121212] overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110"
                style={{ backgroundImage: `url(${item.Poster})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/60 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center px-4 md:px-12 container mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                    <div className="flex-1 text-center md:text-left space-y-4 z-10">
                        <span className="text-[#ff5252] font-bold tracking-widest uppercase text-sm md:text-base">
                            En yeniler
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
                            {item.Title}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-gray-300 text-sm md:text-base">
                            <span className="border border-gray-600 px-2 py-0.5 rounded">{item.Year}</span>
                            <span>IMDb: <span className="text-yellow-500 font-bold">{item.imdbRating}</span></span>
                            <span>{item.Genre?.split(',')[0]}</span>
                        </div>
                        <p className="text-gray-400 max-w-xl mx-auto md:mx-0 line-clamp-3 md:line-clamp-4 text-sm md:text-lg">
                            {item.Plot}
                        </p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                            <button 
                                onClick={() => navigate(`/series/${item.imdbID || item.id}`, { state: item })}
                                className="bg-[#ff5252] cursor-pointer hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105"
                            >
                                <FaPlay /> İncele
                            </button>
                            <button className="bg-gray-800/80 cursor-pointer hover:bg-gray-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-colors backdrop-blur-sm">
                                <FaInfoCircle /> Daha Fazla
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:block w-[300px] h-[450px] z-10 relative transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-black">
                        <img 
                            src={item.Poster} 
                            alt={item.Title} 
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-800"
                        />
                    </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroSlider