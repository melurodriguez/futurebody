import { create } from 'zustand';
import api from '../context/axiosInstance'

export const useTurnosStore = create((set) => ({
  turnos: [],
  error: null,

  getTurnos: async () => {
    try {
        console.log("Intentando conectar a:", api.defaults.baseURL + '/turnos/');
        const response = await api.get('/turnos/',{
            params:{
                usuario_id:1,
                rol:"profesional"
            }
        }); 
        console.log("DATOS RECIBIDOS:", response.data);
        set({ turnos: response.data, error: null });
    } catch (err) {
        console.log("ERROR MESSAGE:", err.message); 
        if (err.response) {
        console.log("STATUS DEL SERVER:", err.response.status); // Si es 404, la URL está mal
        console.log("DATA DEL SERVER:", err.response.data);
        }
        set({ turnos: [], error: 'Error de conexión con el servidor' });
    }
    },

  createTurnos: async (TurnosData) => {
    try {
      const response = await api.post('/turnos', TurnosData);
      set((state) => ({ turnos: [...state.turnos, response.data] }));
    } catch (err) {
      console.error("Error creando turnos", err);
    }
  }
}));