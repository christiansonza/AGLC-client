import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/users',
    credentials: 'include',
  }),
  tagTypes: ['users'],
  endpoints: (builder) => ({
    
    getUser: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
      providesTags: ['users'],
    }),

    
    getUserById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: ['users'],
    }),

   
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: '/register',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['users'],
    }),

   
    loginUser: builder.mutation({
      query: (userData) => ({
        url: '/login',
        method: 'POST',
        body: userData,
      }),
      providesTags: ['users'],
    }),

    
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['users'],
    }),

    currentUser: builder.query({
      query: () => ({
        url: '/loggedUser',
        method: 'GET',
      }),
      providesTags: ['users'],
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['users'],
    }),

  }),
});

export const {
  useGetUserQuery,
  useGetUserByIdQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useCurrentUserQuery,
  useLogoutUserMutation
} = userApi;
