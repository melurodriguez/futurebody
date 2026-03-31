import { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ColorPalette } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LoginForm({navigation}) {
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    })

    const handleChange = (value, field) => {
        setLoginForm({
            ...loginForm,
            [field]: value
        })
    }

    const handleLogin = () => {
        console.log("Datos de acceso:", loginForm);
        navigation.navigate('Main')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.fieldInput}
                    placeholder="tu@email.com"
                    placeholderTextColor={ColorPalette.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={loginForm.email}
                    onChangeText={(text) => handleChange(text, 'email')}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput 
                    style={styles.fieldInput}
                    placeholder="********"
                    placeholderTextColor={ColorPalette.textSecondary}
                    secureTextEntry
                    value={loginForm.password}
                    onChangeText={(text) => handleChange(text, 'password')}
                />
            </View>

            <TouchableOpacity style={styles.ingresarButton} onPress={handleLogin}>
                <Text style={styles.ingresarButtonText}>Ingresar</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <TouchableOpacity>
                    <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.linkText}>No tienes cuenta? <Text style={{color: ColorPalette.accent}}>Regístrate</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorPalette.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: ColorPalette.textPrimary,
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: ColorPalette.textSecondary,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    fieldInput: {
        width: '100%',
        height: 55,
        backgroundColor: ColorPalette.surface,
        borderRadius: 12,
        paddingHorizontal: 15,
        color: ColorPalette.textPrimary, // Texto que escribe el usuario
        borderWidth: 1,
        borderColor: ColorPalette.border,
    },
    ingresarButton: {
        width: '100%',
        height: 55,
        backgroundColor: ColorPalette.primary,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        // Sombra suave para que resalte en el fondo oscuro
        shadowColor: ColorPalette.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    ingresarButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 25,
        alignItems: 'center',
    },
    linkText: {
        color: ColorPalette.textSecondary,
        marginVertical: 8,
        fontSize: 14,
    }
})
