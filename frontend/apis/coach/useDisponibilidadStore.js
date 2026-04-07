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
  updateDisponibilidad: async (usuarioId, disponibilidadId, disponibilidadData) => {
  try {

    const response = await api.patch(
      `/disponibilidad/${disponibilidadId}`, 
      disponibilidadData,
      { 
        params: { usuario_id: usuarioId } 
      }
    );

    set((state) => ({
      disponibilidad: state.disponibilidad.map((item) =>
        item.id === disponibilidadId 
          ? { ...item, estado: disponibilidadData.estado } 
          : item
      ),
    }));
    
    return true;
  } catch (err) {
    console.error("Error detallado en PATCH disponibilidad:", err.response?.data || err.message);
    return false;
  }
},

  createMasiveSlotLoad: async (usuarioId, params) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post(`/disponibilidad/${usuarioId}/generar-agenda`, null, {
                params: {
                    fecha_inicio: params.fecha_inicio,
                    semanas: params.semanas || 2
                }
            });

            set({ loading: false });
            return response.data; 
        } catch (err) {
            set({ 
                error: err.response?.data?.detail || 'Error al generar la agenda masiva', 
                loading: false 
            });
            throw err;
        }
    }
}));