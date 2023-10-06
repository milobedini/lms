import { apiSlice } from '../api/apiSlice';
import { userLoggedIn, userLoggedOut, userRegistration } from './authSlice';

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {
  //
};

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
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: 'login',
        method: 'POST',
        body: { email, password },
        credentials: 'include' as const,
      }),
      //   Store response in Redux
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              token: result.data.activationToken,
              user: result.data.user,
            }),
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    socialLogin: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: 'social-login',
        method: 'POST',
        body: { email, name, avatar },
        credentials: 'include' as const,
      }),
      //   Store response in Redux
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              token: result.data.activationToken,
              user: result.data.user,
            }),
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    logout: builder.query({
      query: () => ({
        url: 'logout',
        method: 'GET',
        credentials: 'include' as const,
      }),
      //   Store response in Redux
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialLoginMutation,
  useLogoutQuery,
} = authApi;
