import { create } from 'zustand';
import api from '../../context/axiosInstance';

export const useClientStore = create((set) => ({
  clients: [],
  stats:null,
  error: null,
  loading: false,

  // GET ALL
  getClients: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/clientes/');
      set({ clients: response.data, error: null });
    } catch (err) {
      set({ error: 'Error de conexión con el servidor', clients: [] });
    } finally {
      set({ loading: false });
    }
  },

  // GET BY ID
  getClientById: async (clientId) => {
    try {
        const response = await api.get(`/clientes/${clientId}`);
        set((state) => ({
            clients: state.clients.map(c => c.id === clientId ? response.data : c)
        }));
        return response.data;
    } catch (err) {
        console.error("Error al obtener detalle del cliente:", err);
        return null;
    }
  },

  // CREATE
  createClient: async (ClientData) => {
    try {
      const response = await api.post('/clientes', ClientData);
      set((state) => ({ clients: [...state.clients, response.data] }));
    } catch (err) {
      console.error("Error creando cliente", err);
    }
  },

  // UPDATE
  updateClient: async (cliente_id, ClientData) => {
    try {
      const response = await api.patch(`/clientes/${cliente_id}`, ClientData);
      set((state) => ({
        clients: state.clients.map((c) =>
          c.id === cliente_id ? response.data : c
        ),
      }));
    } catch (err) {
      console.error("Error actualizando datos del cliente", err);
    }
  },

  // DELETE
  deleteClient: async (cliente_id) => {
    try {
      await api.delete(`/clientes/${cliente_id}`);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== cliente_id),
      }));
    } catch (err) {
      console.error(`Error al eliminar cliente: ${cliente_id}`, err);
    }
  },

  //STATS
  getStats: async () => {
    set({ loading: true }); 
    try {
      const response = await api.get("/clientes/stats");
      set({ stats: response.data, error: null });
    } catch (err) {
      set({ error: 'Error de conexión con el servidor', stats: null });
    } finally {
      set({ loading: false });
    }
  }
}));