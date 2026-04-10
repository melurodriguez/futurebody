import { create } from 'zustand';
import api from '../context/axiosInstance';

export const useTurnosStore = create((set) => ({
  turnos: [],
  error: null,

  getTurnos: async (usuarioId, rol) => {
    try {
      const response = await api.get('/turnos/', {
        params: {
          usuario_id: usuarioId,
          rol: rol
        }
      });
      set({ turnos: response.data, error: null });
    } catch (err) {
      console.error("Error al obtener turnos:", err.response?.data || err.message);
      set({ turnos: [], error: 'Error de conexión con el servidor' });
    }
  },

  createTurnos: async (TurnosData) => {
    try {
      const response = await api.post('/turnos', TurnosData);
      
      // Actualizamos el estado local de turnos
      set((state) => ({ 
        turnos: [...state.turnos, response.data] 
      }));
      
      return response.data; // Retornamos para que el componente sepa que terminó bien
    } catch (err) {
      console.error("Error creando turnos", err);
      throw err; // Lanzamos el error para que el catch del componente lo capture
    }
  }
}));