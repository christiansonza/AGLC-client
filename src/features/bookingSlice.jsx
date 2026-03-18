import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
    credentials: 'include',
  }),
  tagTypes: ['booking', 'bookingDetails'],
  endpoints: (builder) => ({
    //  Booking 
    fetchBooking: builder.query({
      query: () => '/booking',
      providesTags: ['booking'],
    }),
    fetchBookingById: builder.query({
      query: (id) => `/booking/${id}`,
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

    // Booking Details
    fetchBookingDetails: builder.query({
      query: (bookingId) => `/booking/${bookingId}/details`,
      providesTags: ['bookingDetails'],
    }),
    fetchBookingDetailById: builder.query({
      query: ({ bookingId, detailId }) => `/booking/${bookingId}/details/${detailId}`,
      providesTags: ['bookingDetails'],
    }),
    createBookingDetail: builder.mutation({
      query: ({ bookingId, ...newDetail }) => ({
        url: `/booking/${bookingId}/details`, 
        method: 'POST',
        body: newDetail, 
      }),
      invalidatesTags: ['bookingDetails'],
    }),
    updateBookingDetail: builder.mutation({
      query: ({ bookingId, detailId, ...updatedDetail }) => ({
        url: `/booking/${bookingId}/details/${detailId}`,
        method: 'PUT',
        body: updatedDetail,
      }),
      invalidatesTags: ['bookingDetails'],
    }),
  }),
});

export const {
  useFetchBookingQuery,
  useFetchBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useFetchBookingDetailsQuery,
  useFetchBookingDetailByIdQuery,
  useCreateBookingDetailMutation,
  useUpdateBookingDetailMutation,
} = bookingApi;