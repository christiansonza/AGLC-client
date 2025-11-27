import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const paymentRequestDetailApi = createApi({
  reducerPath: 'paymentRequestDetailApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/paymentRequestDetail',
    credentials: 'include',
  }),
  tagTypes: ['paymentRequestDetail'],

  endpoints: (builder) => ({

    getPaymentRequestDetail: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
      providesTags: ['paymentRequestDetail'],
    }),

    getPaymentRequestDetailById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: ['paymentRequestDetail'],
    }),
    getPaymentRequestDetailsByRequestId: builder.query({
      query: (paymentRequestId) => ({
        url: `/request/${paymentRequestId}`,
        method: 'GET',
      }),
      providesTags: ['paymentRequestDetail'],
    }),


    postPaymentRequestDetail: builder.mutation({
      query: (newPayment) => ({
        url: '/',
        method: 'POST',
        body: newPayment,
      }),
      invalidatesTags: ['paymentRequestDetail'],
    }),

    updatePaymentRequestDetail: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['paymentRequestDetail'],
    }),

  }),
});

export const {
  useGetPaymentRequestDetailQuery,
  useGetPaymentRequestDetailByIdQuery,
  useGetPaymentRequestDetailsByRequestIdQuery,
  usePostPaymentRequestDetailMutation,
  useUpdatePaymentRequestDetailMutation,
} = paymentRequestDetailApi;
