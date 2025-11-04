"use client";

import type { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../state/store';

const Providers: FC<PropsWithChildren> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default Providers;
