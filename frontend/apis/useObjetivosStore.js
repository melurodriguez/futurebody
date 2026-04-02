import { create } from 'zustand';
import api from '../context/axiosInstance'

export const useObjetivosStore = create((set) => ({
  objetivos: [],
  error: null,

  getObjetivos: async () => {
    try {
        console.log("Intentando conectar a:", api.defaults.baseURL + '/objetivos/');
        const response = await api.get('/objetivos/'); 
        console.log("DATOS RECIBIDOS:", response.data);
        set({ objetivos: response.data, error: null });
    } catch (err) {
        console.log("ERROR MESSAGE:", err.message); 
        if (err.response) {
        console.log("STATUS DEL SERVER:", err.response.status); // Si es 404, la URL está mal
        console.log("DATA DEL SERVER:", err.response.data);
        }
        set({ objetivos: [], error: 'Error de conexión con el servidor' });
    }
    },

  createObjetivo: async (ObjetivoData) => {
    try {
      const response = await api.post('/Objetivos', ObjetivoData);
      set((state) => ({ objetivos: [...state.objetivos, response.data] }));
    } catch (err) {
      console.error("Error creando objetivos", err);
    }
  }
}));