import { useState } from "react"
import { TextInput, TouchableOpacity, View } from "react-native"

export default function ForgotPasswordScreen({navigation}) {

    const [email, setEmail]=useState("")

    const handleClick=()=>{
        console.log('codigo enviado')
        navigation.navigate('Login')
    }


    return(
        <View>
            <Text>Recupero de contraseña</Text>

            <TextInput
            placeholder="Ingrese su mail"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />

            <TouchableOpacity>
                <Text>
                    Enviar código al correo
                </Text>
            </TouchableOpacity>
        </View>
    )
}