import { create } from 'zustand';
import api from '../../context/axiosInstance'
export const useDisponibilidadStore = create((set) => ({
  disponibilidad: [],
  error: null,

  getDisponibilidad: async () => {
    try {
        console.log("Intentando conectar a:", api.defaults.baseURL + '/disponibilidad/');
        const response = await api.get('/disponibilidad/',{
            params:{
                usuario_id:1
            }
        }); 
        console.log("DATOS RECIBIDOS:", response.data);
        set({ disponibilidad: response.data, error: null });
    } catch (err) {
        console.log("ERROR MESSAGE:", err.message); 
        if (err.response) {
        console.log("STATUS DEL SERVER:", err.response.status); // Si es 404, la URL está mal
        console.log("DATA DEL SERVER:", err.response.data);
        }
        set({ disponibilidad: [], error: 'Error de conexión con el servidor' });
    }
    },

  createDisponibilidad: async (DisponibilidadData) => {
    try {
      const response = await api.post('/disponibilidad', DisponibilidadData);
      set((state) => ({ disponibilidad: [...state.disponibilidad, response.data] }));
    } catch (err) {
      console.error("Error creando cliente", err);
    }
  }
}));