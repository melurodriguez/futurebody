import { create } from "zustand";
import api from "../context/axiosInstance";

export const useUsersStore= create((set, get)=>({
    usuarios:[],
    error:null,
    loading:true,

    getAllUsers: async(rol) =>{
        set({loading:true})
        try{
            const response= await api.get('/usuarios',{
                params:{
                    rol: rol
                }
            })
            set({usuarios: response.data, error:null})
            return response.data
        }catch(err){
            console.error("Error al obtener usuarios", err);
            set({error: "No se pudo obtener usuarios"})
        }finally{
            set({loading: false})
        }
    }
}))