import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/account',
    credentials: 'include',
  }),
  tagTypes: ['account'],

  endpoints: (builder) => ({
    fetchAccount: builder.query({
      query: () => '/',
      providesTags: ['account'],
    }),

    getAccountById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ['account'],
    }),

    postAccount: builder.mutation({
      query: (newAccount) => ({
        url: '/',
        method: 'POST',
        body: newAccount,
      }),
      invalidatesTags: ['account'],
    }),

    updateAccount: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['account'],
    }),

    importExcel: builder.mutation({
      query: (formData) => ({
        url: '/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['account'],
    }),
  }),
});

export const {
  useFetchAccountQuery,
  useGetAccountByIdQuery,
  usePostAccountMutation,
  useUpdateAccountMutation,
  useImportExcelMutation,
} = accountApi;
