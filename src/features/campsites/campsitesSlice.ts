import { createSlice } from '@reduxjs/toolkit';
import type { LegacyCampsite } from '../../types/legacy.types';
import { CAMPSITES } from '../../data/legacy/campsites';
import type { RootState } from '../../state/store';

interface CampsitesState {
  campsitesArray: LegacyCampsite[];
  isLoading: boolean;
  errMsg: string | null;
}

const initialState: CampsitesState = {
  campsitesArray: CAMPSITES,
  isLoading: false,
  errMsg: null,
};

const campsitesSlice = createSlice({
  name: 'campsites',
  initialState,
  reducers: {},
});

export const campsitesReducer = campsitesSlice.reducer;

export const selectAllCampsites = (state: RootState): LegacyCampsite[] =>
  state.campsites.campsitesArray;

export const selectCampsiteById =
  (id?: number) =>
  (state: RootState): LegacyCampsite | undefined => {
    if (typeof id !== 'number' || Number.isNaN(id)) {
      return undefined;
    }
    return state.campsites.campsitesArray.find((campsite) => campsite.id === id);
  };

export const selectFeaturedCampsite = (state: RootState): LegacyCampsite | undefined =>
  state.campsites.campsitesArray.find((campsite) => campsite.featured);

export const selectCampsitesLoading = (state: RootState): boolean => state.campsites.isLoading;
export const selectCampsitesError = (state: RootState): string | null => state.campsites.errMsg;
