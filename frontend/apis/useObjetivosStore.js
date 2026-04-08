import { create } from 'zustand';
import api from '../context/axiosInstance'

export const useObjetivosStore = create((set) => ({
  tipos:[],
  objetivos: [],
  error: null,

  getAllTipos: async()=>{
    try{
      const response=await api.get('/objetivos')
      set({tipos: response.data, error:null})
    }catch (err) {
        console.error("Error en la petición:", err.response?.data || err.message);
        set({ tipos: [], error: 'Error al obtener tipos de objetivos' });
    }
  },
  
  getObjetivosByCliente: async (clienteId, usuarioId, esProfesional) => {
    try {
        const response = await api.get(`/objetivos/${clienteId}`, {
            params: {
                cliente_id: clienteId,
                usuario_id: usuarioId,
                es_profesional: esProfesional
            }
        }); 
        
        set({ objetivos: response.data, error: null });
    } catch (err) {
        console.error("Error en la petición:", err.response?.data || err.message);
        set({ objetivos: [], error: 'Error al obtener objetivos' });
    }
  },

  createObjetivo: async (ObjetivoData) => {
    try {
      const response = await api.post('/Objetivos', ObjetivoData);
      set((state) => ({ objetivos: [...state.objetivos, response.data] }));
    } catch (err) {
      console.error("Error creando objetivos", err);
    }
  },

  updateObjetivo: async (objetivoId, clienteId, esProfesional, dataUpdate) => {
    try {
        const response = await api.patch(`/objetivos/${objetivoId}`, dataUpdate, {
          params: {
            cliente_id: clienteId,
            es_profesional: esProfesional,
          }
        });
        set((state) => ({
            objetivos: state.objetivos.map(obj => obj.id === objetivoId ? response.data : obj)
        }));
        return true;
    } catch (err) {
        console.error("Error al actualizar:", err.response?.data || err.message);
        return false;
    }
  }
}));