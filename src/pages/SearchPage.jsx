import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { clearSearchResults, searchSeries } from '../store/SeriesSlice';
import SeriesDetail from './SeriesDetail'
import SeriesCard from '../components/SeriesCard';

function SearchPage() {
    const { query } = useParams();
    const dispatch = useDispatch();

    const { searchResults, status } = useSelector((state) => state.series);

    useEffect(() => {
        if(query)
        {
            dispatch(searchSeries(query));
        }
        return () => dispatch(clearSearchResults());
    }, [dispatch, query]);

    console.log("Arama Durumu:", status);
console.log("Gelen Veri:", searchResults);

  return (
    <div className="bg-[#121212] min-h-screen p-8">
        <h1 className='text-3xl font-bold mb-8 text-center'>
            "<span className="text-[#ff5252]">{query}</span>" için sonuçlar
        </h1>
        
        {/* yükleniyor ekranı */}
        {status === 'loading' && <div className="text-center text-xl">Aranıyor...</div>}
        
        {/* Dizi Bulunamadı Ekranı */}
        {status === 'succeeded' && searchResults?.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
                Maalesef aradığınız kriterlere uygun bir dizi bulunamadı.
            </div>
        )}

        {/* Başarılı ekran */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
            {searchResults?.map((item) => (
                <SeriesCard 
                    key={item.imdbID}
                    data={{
                    id: item.imdbID,
                    title: item.Title,
                    image: item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/300x450?text=No+Image",
                    description: item.Year // Arama sonucunda açıklama gelmez, yıl gösterelim
                    }}
                />
            ))}
        </div>

    </div>
  )
}

export default SearchPage