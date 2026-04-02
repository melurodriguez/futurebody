import { create } from 'zustand';
import api from '../../context/axiosInstance'
export const useClientStore = create((set) => ({
  clients: [],
  error: null,

  getClients: async () => {
    try {
        console.log("Intentando conectar a:", api.defaults.baseURL + '/clientes/');
        const response = await api.get('/clientes/'); 
        console.log("DATOS RECIBIDOS:", response.data);
        set({ clients: response.data, error: null });
    } catch (err) {
        console.log("ERROR MESSAGE:", err.message); 
        if (err.response) {
        console.log("STATUS DEL SERVER:", err.response.status); // Si es 404, la URL está mal
        console.log("DATA DEL SERVER:", err.response.data);
        }
        set({ clients: [], error: 'Error de conexión con el servidor' });
    }
    },

  createClient: async (ClientData) => {
    try {
      const response = await api.post('/clients', ClientData);
      set((state) => ({ clients: [...state.clients, response.data] }));
    } catch (err) {
      console.error("Error creando cliente", err);
    }
  }
}));