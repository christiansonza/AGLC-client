import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const vesselApi = createApi({
    reducerPath:'vesselApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:4000/vessel', credentials:'include'}),
    tagTypes:['vessel'],
    endpoints:(builder)=>({
        getVessel:builder.query({
            query:()=>({
                url:'/',
                method:'GET'
            }),
            providesTags:['vessel']
        }),
        getVesselById:builder.query({
            query:(id)=>({
                url:`/${id}`,
                method:'GET',
            }),
            providesTags:['vessel']
        }),
        createVessel: builder.mutation({
            query: (newData) => ({
                url: '/',
                method: 'POST',
                body: newData,
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['vessel'],
        }),
        updateVessel:builder.mutation({
            query:({id, ...updateData})=>({
                url:`/${id}`,
                method:'PUT',
                body:updateData
            }),
            invalidatesTags:['vessel']
        })
    })

})


export const {useGetVesselQuery, useGetVesselByIdQuery, useCreateVesselMutation, useUpdateVesselMutation} = vesselApi