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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: ColorPalette.background,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 24,
        paddingBottom: 50,
        paddingTop: 12,
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: ColorPalette.border,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        color: ColorPalette.textPrimary,
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 25,
        textAlign: 'center'
    },
    label: {
        color: ColorPalette.textSecondary,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: ColorPalette.surface,
        color: ColorPalette.textPrimary,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: ColorPalette.border
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 30,
    },
    genderBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: ColorPalette.border,
        alignItems: 'center',
        backgroundColor: ColorPalette.surface,
    },
    genderBtnActive: {
        backgroundColor: ColorPalette.secondary, // El lila clarito
        borderColor: ColorPalette.primary, // El lila fuerte
    },
    genderText: {
        color: ColorPalette.textSecondary,
        fontWeight: '600',
    },
    genderTextActive: {
        color: ColorPalette.primary,
        fontWeight: '700',
    },
    primaryButton: {
        backgroundColor: ColorPalette.primary, // Lila #7C3AED
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',
        shadowColor: ColorPalette.primary,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16
    },
    cancelBtn: {
        marginTop: 20,
        alignItems: 'center'
    },
    cancelText: {
        color: ColorPalette.textMuted,
        fontWeight: '600',
        fontSize: 15
    }
});