import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../context/axiosInstance';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          // 1. Para OAuth2 en FastAPI con Axios, usamos URLSearchParams
          const params = new URLSearchParams();
          params.append('username', email);
          params.append('password', password);

          // 2. En Axios: api.post(url, data, config)
          const response = await api.post('/auth/login', params, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          // 3. Axios ya formatea el JSON en response.data
          const data = response.data;

          set({ 
            user: data.user, 
            token: data.access_token, 
            loading: false 
          });
          return { success: true };

        } catch (error) {
          set({ loading: false });
          
          // 4. Manejo de errores de Axios (el 422 viene aquí)
          let errorMessage = 'Error de red o servidor';
          
          if (error.response) {
            // El servidor respondió con un status fuera del rango 2xx
            console.log("Error Data:", error.response.data);
            errorMessage = error.response.data.detail || 'Error de credenciales';
            
            // Si el error es el 422 de validación de FastAPI, suele venir como array
            if (Array.isArray(errorMessage)) {
                errorMessage = errorMessage[0].msg;
            }
          }

          return { success: false, message: errorMessage };
        }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);