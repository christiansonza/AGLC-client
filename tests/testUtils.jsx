import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';

import { bookingApi } from '../src/features/bookingSlice';
import { customerApi } from '../src/features/customerSlice';

export function renderWithProviders(ui) {
  const store = configureStore({
    reducer: {
      [bookingApi.reducerPath]: bookingApi.reducer,
      [customerApi.reducerPath]: customerApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(bookingApi.middleware)
        .concat(customerApi.middleware),
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}