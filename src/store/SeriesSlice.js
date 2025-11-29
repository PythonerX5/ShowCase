import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY; 


export const fetchSeriesDetail = createAsyncThunk('series/fetchDetail', async (id) => {
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&type=series&apikey=${API_KEY}`);
    return await response.json();
})



export const fetchMultipleSeries = createAsyncThunk('series/fetchMultiple', async (titles) => {
  const promises = titles.map(async (title) => {
    const response = await fetch(`https://www.omdbapi.com/?t=${title}&type=series&apikey=${API_KEY}`);
    const data = await response.json();
    //console.log(`OMDb Cevabı (${title}):`, data);
    return data;
  });

  const results = await Promise.all(promises);
  return results.filter(item => item.Response === "True");
});


export const searchSeries = createAsyncThunk('series/search', async (searchTerm) => {
  const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&type=series&apikey=${API_KEY}`);
  return await response.json();
});


const seriesSlice = createSlice({
  name: 'series',
  initialState: {
    seriesList: [], //Ana sayfada gözükenlerin listesi
    searchResults: [], //aramada gözükecekler
    selectedSeries: null,
    status: 'idle',
    error: null
  },
  reducers: {
    clearSelectedSeries: (state) => {
        state.selectedSeries = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMultipleSeries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMultipleSeries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.seriesList = action.payload; 
      })
      .addCase(fetchMultipleSeries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSeriesDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSeriesDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedSeries = action.payload; // Detayı kaydet
      })
      .addCase(fetchSeriesDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(searchSeries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchSeries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if(action.payload.Response === 'True')
        {
          state.searchResults = action.payload.Search;
        }
        else
        {
          state.searchResults = [];
        }
      })
      .addCase(searchSeries.rejected, (state, action) => {
        state.status = 'failed';
      })
  },
});

export const { clearSelectedSeries, clearSearchResults} = seriesSlice.actions;
export default seriesSlice.reducer;