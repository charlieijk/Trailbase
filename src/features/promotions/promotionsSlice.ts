import { createSlice } from '@reduxjs/toolkit';
import { PROMOTIONS } from '../../data/legacy/promotions';
import type { LegacyPromotion } from '../../types/legacy.types';
import type { RootState } from '../../state/store';

interface PromotionsState {
  promotionsArray: LegacyPromotion[];
  isLoading: boolean;
  errMsg: string | null;
}

const initialState: PromotionsState = {
  promotionsArray: PROMOTIONS,
  isLoading: false,
  errMsg: null,
};

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {},
});

export const promotionsReducer = promotionsSlice.reducer;

export const selectAllPromotions = (state: RootState): LegacyPromotion[] =>
  state.promotions.promotionsArray;

export const selectFeaturedPromotion = (state: RootState): LegacyPromotion | undefined =>
  state.promotions.promotionsArray.find((promotion) => promotion.featured);

export const selectPromotionsLoading = (state: RootState): boolean => state.promotions.isLoading;
export const selectPromotionsError = (state: RootState): string | null => state.promotions.errMsg;
