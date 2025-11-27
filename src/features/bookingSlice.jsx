import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
    credentials: 'include',
  }),
  tagTypes: ['booking'],
  endpoints: (builder) => ({
    fetchBooking: builder.query({
      query: () => ({
        url: '/booking',
        method: 'GET',
      }),
      providesTags: ['booking'],
    }),

    fetchBookingById: builder.query({
      query: (id) => ({
        url: `/booking/${id}`,
        method: 'GET',
      }),
      providesTags: ['booking'],
    }),

    createBooking: builder.mutation({
      query: (newBooking) => ({
        url: '/booking',
        method: 'POST',
        body: newBooking,
      }),
      invalidatesTags: ['booking'],
    }),

    updateBooking: builder.mutation({
      query: ({ id, ...updatedBooking }) => ({
        url: `/booking/${id}`,
        method: 'PUT',
        body: updatedBooking,
      }),
      invalidatesTags: ['booking'],
    }),
  }),
});

export const {
  useFetchBookingQuery,
  useFetchBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
} = bookingApi;
