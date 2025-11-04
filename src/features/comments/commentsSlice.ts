import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LegacyComment } from '../../types/legacy.types';
import { COMMENTS } from '../../app/shared/oldData/COMMENTS';
import type { RootState } from '../../app/store';

interface CommentsState {
  commentsArray: LegacyComment[];
  isLoading: boolean;
  errMsg: string | null;
}

type NewCommentPayload = Omit<LegacyComment, 'id'>;

const initialState: CommentsState = {
  commentsArray: COMMENTS,
  isLoading: false,
  errMsg: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<NewCommentPayload>) => {
      const nextId =
        state.commentsArray.length > 0
          ? Math.max(...state.commentsArray.map((comment) => comment.id)) + 1
          : 0;

      state.commentsArray.push({
        id: nextId,
        ...action.payload,
      });
    },
    setCommentsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCommentsError: (state, action: PayloadAction<string | null>) => {
      state.errMsg = action.payload;
    },
  },
});

export const commentsReducer = commentsSlice.reducer;

export const { addComment, setCommentsError, setCommentsLoading } = commentsSlice.actions;

export const selectCommentsByCampsiteId =
  (campsiteId: number) =>
  (state: RootState): LegacyComment[] =>
    state.comments.commentsArray.filter((comment) => comment.campsiteId === campsiteId);

export const selectCommentsLoading = (state: RootState): boolean => state.comments.isLoading;
export const selectCommentsError = (state: RootState): string | null => state.comments.errMsg;
