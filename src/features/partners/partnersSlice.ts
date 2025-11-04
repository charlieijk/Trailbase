import { createSlice } from '@reduxjs/toolkit';
import { PARTNERS } from '../../app/shared/oldData/PARTNERS';
import type { LegacyPartner } from '../../types/legacy.types';
import type { RootState } from '../../app/store';

interface PartnersState {
  partnersArray: LegacyPartner[];
  isLoading: boolean;
  errMsg: string | null;
}

const initialState: PartnersState = {
  partnersArray: PARTNERS,
  isLoading: false,
  errMsg: null,
};

const partnersSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {},
});

export const partnersReducer = partnersSlice.reducer;

export const selectAllPartners = (state: RootState): LegacyPartner[] =>
  state.partners.partnersArray;

export const selectFeaturedPartner = (state: RootState): LegacyPartner | undefined =>
  state.partners.partnersArray.find((partner) => partner.featured);

export const selectPartnersLoading = (state: RootState): boolean => state.partners.isLoading;
export const selectPartnersError = (state: RootState): string | null => state.partners.errMsg;
