import { create } from 'zustand';
import api from '../../context/axiosInstance';

export const useClientStore = create((set, get) => ({
  clients: [],
  currentCliente: null, 
  stats: null,
  error: null,
  loading: false,

  // Inicializar o buscar el cliente logueado (Global)
  fetchCurrentCliente: async (userId) => {
    set({ loading: true });
    try {
      const response = await api.get(`/clientes/${userId}`);
      set({ currentCliente: response.data, error: null });
      return response.data;
    } catch (err) {
      console.error("Error al obtener el perfil del cliente logueado:", err);
      set({ error: "No se pudo cargar el perfil del cliente" });
    } finally {
      set({ loading: false });
    }
  },

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

  // GET BY ID (si es el mismo usuario, actualiza currentCliente)
  getClientById: async (clientId) => {
    try {
      const idToFind = Number(clientId);
      const response = await api.get(`/clientes/${idToFind}`);
      
      if (response.data) {
        set((state) => ({
          clients: state.clients.map(c => 
            Number(c.id) === idToFind ? response.data : c
          ),
          currentCliente: state.currentCliente?.id === idToFind ? response.data : state.currentCliente
        }));
        return response.data;
      }
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

  // UPDATE (sincroniza con currentCliente)
  updateClient: async (cliente_id, ClientData) => {
    try {
      const response = await api.patch(`/clientes/${cliente_id}`, ClientData);
      set((state) => ({
        clients: state.clients.map((c) =>
          c.id === cliente_id ? response.data : c
        ),
        currentCliente: state.currentCliente?.id === cliente_id ? response.data : state.currentCliente
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
        currentCliente: state.currentCliente?.id === cliente_id ? null : state.currentCliente
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
  },

  //CREAR MEDICION
  createMedicion: async (clienteId, esProfesional, data) => {
    set({ loading: true });
    try {
      const response = await api.post(`/mediciones/?cliente_id=${clienteId}&es_profesional=${esProfesional}`, data);
      return response.data;
    } catch (err) {
      console.error("Error en createMedicion:", err);
      throw err; 
    } finally {
      set({ loading: false });
    }
  },


  //CREAR MEDIDA
  createMedidaCorporal: async (clienteId, esProfesional, data) => {
    set({ loading: true });
    try {
      const response = await api.post(`/medidas/?cliente_id=${clienteId}&es_profesional=${esProfesional}`, data);
      return response.data;
    } catch (err) {
      console.error("Error en createMedidaCorporal:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  //DELETE MEDICION
  deleteMedicion: async (medicionId, clienteId, esProfesional) => {
    set({ loading: true });
    try {
      await api.delete(`/mediciones/${medicionId}`, {
        params: {
          cliente_id: clienteId,
          es_profesional: esProfesional
        }
      });
      return true;
    } catch (err) {
      console.error("Error al eliminar medición:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // DELETE MEDIDA CORPORAL
  deleteMedidaCorporal: async (medidaId, clienteId, esProfesional) => {
    set({ loading: true });
    try {
      await api.delete(`/medidas/${medidaId}`, {
        params: {
          cliente_id: clienteId,
          es_profesional: esProfesional
        }
      });
      return true;
    } catch (err) {
      console.error("Error al eliminar medida corporal:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  resetClientStore: () => set({ clients: [], currentCliente: null, stats: null, error: null })
}));