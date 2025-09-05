import axiosClient from './axiosClient';

export const AuthApi = {
  logIn: async (email: string, password: string) => {
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error while login:', error);
      throw error;
    }
  },
};
