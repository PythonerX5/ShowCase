import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import SeriesCard from './SeriesCard'


function SeriesRow({ title, series}) {
    if(!series || series?.length === 0 ) return null;

  return (
    <div className="mb-8 px-4 md:px-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 border-l-4 border-[#ff5252] pl-3">
        {title}
      </h2>
      
      <Swiper
        spaceBetween={15}
        slidesPerView={2.2} // Mobilde 2.5 tane görünsün (kaydığı belli olsun)
        breakpoints={{
          640: { slidesPerView: 3.2, spaceBetween: 20 },
          768: { slidesPerView: 4.2, spaceBetween: 20 },
          1024: { slidesPerView: 5.2, spaceBetween: 20 },
          1280: { slidesPerView: 6.2, spaceBetween: 20 },
        }}
        className="w-full py-4"
      >
        {series.map((item) => (
          <SwiperSlide key={item.id}>
             {/* Mevcut SeriesCard bileşenini kullanıyoruz */}
             <SeriesCard 
                data={{
                    id: item.imdbID || item.id, // Firestore'da id, OMDb'de imdbID olabilir
                    title: item.Title || item.title, // İsimlendirme farklarını yönet
                    image: item.Poster || item.image,
                    description: ""
                }}
             />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default SeriesRow