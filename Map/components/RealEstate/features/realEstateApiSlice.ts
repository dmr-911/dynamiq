import { apiSlice } from './redux/features/api/apiSlice';
import { convertSearchParams } from '../utils/convertSearchParams';

export const realEstateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchRealEstateAddress: builder.query({
      query: (args) => {
        const params = convertSearchParams(args as any);
        return {
          url: `/property/autoComplete${params && params}`
        };
      }
    })
    // upsertAppearance: builder.mutation({
    //   query: (body) => {
    //     return {
    //       url: '/tenant/appearance',
    //       method: 'PUT',
    //       body
    //     };
    //   }
    // })
  })
});

export const { useFetchRealEstateAddressQuery } = realEstateApiSlice;
