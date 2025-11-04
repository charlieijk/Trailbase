import { createSlice } from '@reduxjs/toolkit';
import { CAMPSITES } from '../../app/shared/oldData/CAMPSITES';

const initialState = {
    campsitesArray: CAMPSITES
};

const campsitesSlice = createSlice({
    name: 'campsites',
    initialState,
    reducers: {}
});

export const campsitesReducer = campsitesSlice.reducer;

export const selectAllCampsites = (state) => state.campsites.campsitesArray;

export const selectCampsiteById = (id) => (state) => {
    return state.campsites.campsitesArray.find(
        (campsite) => campsite.id === parseInt(id)
    );
};

export const selectFeaturedCampsite = (state) => {
    return state.campsites.campsitesArray.find((campsite) => campsite.featured);
};