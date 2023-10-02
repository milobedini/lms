import { apiSlice } from '../api/apiSlice';
import { userRegistration } from './authSlice';

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoints
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      // REQUEST
      query: (data) => ({
        url: 'registration',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      //   Store response in Redux
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            }),
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: 'activate',
        method: 'POST',
        body: { activation_token, activation_code },
      }),
    }),
  }),
});

export const { useRegisterMutation, useActivationMutation } = authApi;
