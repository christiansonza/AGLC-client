import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
    credentials: 'include',
  }),
  tagTypes: ['booking', 'bookingDetails', 'journal'],

  endpoints: (builder) => ({
    // Booking
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
      query: ({ bookingId, detailId }) =>
        `/booking/${bookingId}/details/${detailId}`,
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

    // Journal Booking
    getAllJournals: builder.query({
      query: () => `/booking/journals`, 
      providesTags: ['journal'],
    }),

    fetchJournalBooking: builder.query({
      query: (bookingId) => `/booking/${bookingId}/journals`,
      providesTags: (result, error, bookingId) => [{ type: 'journal', id: bookingId }],
    }),

    fetchJournalBookingById: builder.query({
      query: ({ bookingId, journalId }) =>
        `/booking/${bookingId}/journals/${journalId}`,
      providesTags: ['journal'],
    }),

    createJournalBooking: builder.mutation({
      query: ({ bookingId, ...newJournal }) => ({
        url: `/booking/${bookingId}/journals`,
        method: 'POST',
        body: newJournal,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: 'journal', id: bookingId },
      ],
    }),

    // updateJournalBooking: builder.mutation({
    //   query: ({ bookingId, journalId, ...updatedJournal }) => ({
    //     url: `/booking/${bookingId}/journal/${journalId}`,
    //     method: 'PUT',
    //     body: updatedJournal,
    //   }),
    //   invalidatesTags: (result, error, { bookingId }) => [
    //     { type: 'journal', id: bookingId },
    //   ],
    // }),
  }),
});

export const {
  // Booking
  useFetchBookingQuery,
  useFetchBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,

  // Booking Details
  useFetchBookingDetailsQuery,
  useFetchBookingDetailByIdQuery,
  useCreateBookingDetailMutation,
  useUpdateBookingDetailMutation,

  // Journal
  useFetchJournalBookingQuery,
  useFetchJournalBookingByIdQuery,
  useCreateJournalBookingMutation,
  useGetAllJournalsQuery
  // useUpdateJournalBookingMutation,
} = bookingApi;