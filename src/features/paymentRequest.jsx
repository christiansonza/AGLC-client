import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentRequestApi = createApi({
  reducerPath: 'paymentRequestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/paymentRequest',
    credentials: 'include'
  }),
  tagTypes: ['paymentRequest'],
  endpoints: (builder) => ({
    
    fetchPaymentRequest: builder.query({
      query: () => ({
        url: '/',
        method: 'GET'
      }),
      providesTags: ['paymentRequest']
    }),

    fetchPaymentRequestById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET'
      }),
      providesTags: ['paymentRequest']
    }),

    postPaymentRequest: builder.mutation({
      query: (newPaymentRequest) => ({
        url: '/',
        method: 'POST',
        body: newPaymentRequest
      }),
      invalidatesTags: ['paymentRequest']
    }),

   updatePaymentRequest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ['paymentRequest']
    }),
    deletePaymentRequest: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["paymentRequest"],
    }),
    deleteAllDetails: builder.mutation({
      query: (id) => ({
        url: `/details/${id}`, 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['paymentRequest'],
  }),
  })
});

export const {
  useFetchPaymentRequestQuery,
  useFetchPaymentRequestByIdQuery,
  usePostPaymentRequestMutation,
  useUpdatePaymentRequestMutation,
  useDeletePaymentRequestMutation,
  useDeleteAllDetailsMutation
} = paymentRequestApi;
