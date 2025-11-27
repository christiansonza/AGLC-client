import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chargeSlice = createApi({
  reducerPath: 'chargeSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/charge',
    credentials: 'include',
  }),
  tagTypes: ['charge'],

  endpoints: (builder) => ({
    fetchCharge: builder.query({
      query: () => '/',
      providesTags: ['charge'],
    }),

    getChargeById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ['charge'],
    }),

    postCharge: builder.mutation({
      query: (newAccount) => ({
        url: '/',
        method: 'POST',
        body: newAccount,
      }),
      invalidatesTags: ['charge'],
    }),

    updateCharge: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['charge'],
    }),

  }),
});

export const {
  useFetchChargeQuery,
  useGetChargeByIdQuery,
  usePostChargeMutation,
  useUpdateChargeMutation,
} = chargeSlice;
