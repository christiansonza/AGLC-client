import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const branchApi =  createApi({
    reducerPath:'branchApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:4000/branch', credentials:'include'}),
    tagTypes:['branch'],
    endpoints:(builder)=>({
        fetchBranch:builder.query({
            query:()=>({
                url:'/',
                method:'GET'
            }),
            providesTags:['branch']
        }),
        fetchBranchById:builder.query({
            query:(id)=>({
                url:`/${id}`,
                method:'GET'
            }),
            providesTags:['branch']
        }),
        createBranch:builder.mutation({
            query:(newData)=>({
                url:'/',
                method:'POST',
                body:newData
            }),
            invalidatesTags:['branch']
        }),
        updateBranch:builder.mutation({
            query:({id, ...updateData})=>({
                url:`/${id}`,
                method:'PUT',
                body:updateData
            })
        })
    })
})


export const { useFetchBranchQuery, useFetchBranchByIdQuery, useCreateBranchMutation, useUpdateBranchMutation} = branchApi