import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const fundApi = createApi({
    reducerPath:'fundApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:4000/pettyCashFund', credentials:'include'}),
    tagTypes:['fund'],
    endpoints:(builder)=>({
        fetchPettyCashFund:builder.query({
            query:()=>({
                url:'/',
                method:'GET'
            }),
            providesTags:['fund']
        }),
        fetchPettyCashFundById:builder.query({
            query:(id)=>({
                url:`${id}`,
                method:'GET'
            }),
            providesTags:['fund']
        }),
        createPettyCashFund:builder.mutation({
            query:(newData)=>({
                url:'/',
                method:'POST',
                body:newData
            }),
            invalidatesTags:['fund']
        }),
        updatePettyCashFund:builder.mutation({
            query:({id, ...newData})=>({
                url:`${id}`,
                method:'PUT',
                body:newData
            }),
            invalidatesTags:['fund']
        }),
    })
})


export const {
    useFetchPettyCashFundQuery,
    useFetchPettyCashFundByIdQuery,
    useCreatePettyCashFundMutation,
    useUpdatePettyCashFundMutation,
} = fundApi