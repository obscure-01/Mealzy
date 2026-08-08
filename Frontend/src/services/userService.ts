// src/services/userService.ts
import api from './api';

export const userService = {
  updateProfile: async (data: FormData): Promise<void> => {
    // We pass the FormData directly. Axios automatically sets the Content-Type 
    // to multipart/form-data with the correct boundary when passing FormData.
    await api.put('/users', data);
  },
};
