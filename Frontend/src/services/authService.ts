// src/services/authService.ts
import api from './api';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_picture_url?: string;
  phone_number?: string;
}

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Pad string with '=' to make it a multiple of 4
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT Decode Error:', e);
    return null;
  }
};

export const authService = {
  login: async (phone_number: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/logIn', { phone_number, password });
    return response.data;
  },

  register: async (data: { name: string; email: string; password: string; phone_number: string }): Promise<RegisterResponse> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.get('/auth/logOut');
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.get('/auth/accessToken');
    return response.data;
  },

  getUserProfile: async (token: string): Promise<User> => {
    const payload = decodeJwt(token);
    if (!payload || !payload.user_id) {
      throw new Error('Invalid token structure');
    }
    const response = await api.get(`/users/${payload.user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const info = response.data.user_info;
    return {
      id: info.user_id,
      name: info.name,
      email: info.email,
      role: info.role,
      phone_number: info.phone_number,
      profile_picture_url: info.profile_picture
    };
  }
};
