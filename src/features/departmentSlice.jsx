import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const departmentApi = createApi({
    reducerPath:'departmentApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:4000/department', credentials:'include'}),
    tagTypes:['department'],
    endpoints:(builder)=>({
        fetchDepartment:builder.query({
            query:()=>({
                url:'/',
                method:'GET'
            }),
            providesTags:['department']
        }),
        fetchDepartmentById:builder.query({
            query:(id)=>({
                url:`/${id}`,
                method:'GET',
            })
        }),
        postDepartment:builder.mutation({
            query:(newDepartment)=>({
                url:'/',
                method:'POST',
                body:newDepartment
            }),
            invalidatesTags:['department']
        }),
        updateDepartment: builder.mutation({
        query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
    }),
    invalidatesTags: ['department'],
})

    })
})

export const {
  useFetchDepartmentQuery,
  usePostDepartmentMutation,
  useFetchDepartmentByIdQuery,
  useUpdateDepartmentMutation
} = departmentApi;
