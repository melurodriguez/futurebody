import React, { useState } from "react";
import { Modal, TextInput, TouchableOpacity, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { ColorPalette } from "../../theme";

export default function CreateUserModal({ visible, onClose }) {
    const [userForm, setUserForm] = useState({
        email: "",
        alias: "",
        password: "",
        ia_active: true,
        is_profile_complete: false
    });

    const handleChange = (field, value) => {
        setUserForm({
            ...userForm,
            [field]: value
        });
    };

    const handleRegistration = () => {
        console.log("Registrando usuario:", userForm);
        // Aquí iría tu lógica de fetch a FastAPI
    };

    return (
        <Modal 
            visible={visible} 
            animationType="slide" // Esto hace que suba desde abajo
            transparent={true}
            onRequestClose={onClose}
        >
            {/* El KeyboardAvoidingView evita que el teclado tape los inputs */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableOpacity 
                    style={styles.overlay} 
                    activeOpacity={1} 
                    onPress={onClose} // Si tocan fuera, se cierra
                >
                    <View style={styles.sheetContainer}>
                        {/* Indicador visual de que es algo que se puede arrastrar o cerrar */}
                        <View style={styles.dragHandle} />

                        <Text style={styles.title}>Nuevo Usuario</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            placeholderTextColor="#64748b"
                            // ... resto de props
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Alias"
                            placeholderTextColor="#64748b"
                            // ... resto de props
                        />

                        <TextInput
                        style={styles.input}
                        placeholder="*******"
                        placeholderTextColor="#64748b"
                        secureTextEntry={true} // CORRECTO: Para contraseñas
                        value={userForm.password}
                        onChangeText={(text) => handleChange('password', text)}
                        />

                        <TouchableOpacity style={styles.primaryButton}>
                            <Text style={styles.buttonText}>Confirmar Registro</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                            <Text style={{color: 'red'}}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end', // ALINEA AL FONDO
    },
    sheetContainer: {
        backgroundColor: ColorPalette.background, // Fondo ultra dark
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: 40, // Espacio extra para que no pegue abajo
        paddingTop: 12,
        // Sombra para que se note la elevación
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 20,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#374151',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 25,
        textAlign: 'center'
    },
    input: {
        backgroundColor: ColorPalette.surface,
        color: 'black',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: ColorPalette.border
    },
    primaryButton: {
        backgroundColor: '#3B5BFF', // Tu Azul Eléctrico
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    cancelBtn: {
        marginTop: 20,
        alignItems: 'center'
    }
});