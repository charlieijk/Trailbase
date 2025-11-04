import { createSlice } from '@reduxjs/toolkit';
import { PARTNERS } from '../../app/shared/oldData/PARTNERS';

const initialState = {
    partnersArray: PARTNERS
};

const partnersSlice = createSlice({
    name: 'partners',
    initialState,
    reducers: {}
});

export const partnersReducer = partnersSlice.reducer;

export const selectAllPartners = (state) => state.partners.partnersArray;

export const selectFeaturedPartner = (state) => {
    return state.partners.partnersArray.find((partner) => partner.featured);
};
