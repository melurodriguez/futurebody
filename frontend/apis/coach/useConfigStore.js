import { create } from "zustand";
import api from "../../context/axiosInstance";

export const useConfigStore = create((set, get) => ({
    config: null,
    error: null,
    loading: false,

    // GET: Obtener configuración existente
    getConfigByUser: async (usuarioId) => {
        set({ loading: true });
        try {
            const response = await api.get(`/configuracion-coach/${usuarioId}`);
            set({ config: response.data, error: null });
        } catch (err) {
            set({ config: null, error: 'Error al cargar la configuración' });
        } finally {
            set({ loading: false });
        }
    },


    createConfig: async (usuarioId, configData) => {
        set({ loading: true });
        try {
            const response = await api.post(`/configuracion-coach/`, 
                { ...configData, usuario_id: usuarioId },
                { params: { usuario_id: usuarioId } }    
            );
            set({ config: response.data, error: null });
            return response.data;
        } catch (err) {
            set({ error: 'Error al crear la configuración' });
            throw err;
        } finally {
            set({ loading: false });
        }
    },


    updateConfig: async (usuarioId, configData) => {
        set({ loading: true });
        try {
            const response = await api.patch(`/configuracion-coach/${usuarioId}`, configData);
            set({ config: response.data, error: null });
            return response.data;
        } catch (err) {
            set({ error: 'Error al actualizar la configuración' });
            throw err;
        } finally {
            set({ loading: false });
        }
    },


    
}));