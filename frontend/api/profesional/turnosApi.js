async function get_turnos(){
    try{
        const res=await fetch('http://localhost:8000/api/v1/turnos',{
            method:'GET'
        })
        if (!res.ok){
            return {error: "Error al obtener turnos en get_turnos"}
        }
         const data=await res.json()
         return data
    }catch(err){
        throw err
    }
}