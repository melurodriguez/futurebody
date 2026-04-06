import { create } from 'zustand';
import api from '../../context/axiosInstance'
export const useDisponibilidadStore = create((set) => ({
  disponibilidad: [],
  error: null,

  getDisponibilidad: async (usuarioId) => { 
      try {
          const response = await api.get('/disponibilidad/', {
              params: { usuario_id: usuarioId }
          }); 
          set({ disponibilidad: response.data, error: null });
      } catch (err) {
          set({ disponibilidad: [], error: 'Error al cargar agenda' });
      }
  },

  createDisponibilidad: async (DisponibilidadData) => {
    try {
      const response = await api.post('/disponibilidad', DisponibilidadData);
      set((state) => ({ disponibilidad: [...state.disponibilidad, response.data] }));
    } catch (err) {
      console.error("Error creando cliente", err);
    }
  },
  updateDisponibilidad: async (id, nuevoEstado) => {
    try {
      // nuevoEstado será 'disponible' o 'no_disponible'
      await api.patch(`/disponibilidad/${id}`, { estado: nuevoEstado });
      set((state) => ({
        disponibilidad: state.disponibilidad.map((slot) =>
          slot.id === id ? { ...slot, estado: nuevoEstado } : slot
        ),
      }));
      return true;
    } catch (err) {
      console.error("Error actualizando disponibilidad:", err);
      return false;
    }
  },
}));