import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Users, Venus, Mars, ChevronRight } from 'lucide-react-native'; // Cambiamos iconos
import { ColorPalette } from "../../theme";
import { useNavigation } from '@react-navigation/native'; // Importante para navegar
import { useClientStore } from '../../apis/coach/useClientsStore'; 

export default function ClientCard({ item }) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const { getClientById } = useClientStore();

    const handlePress = async () => {
        try {
            setLoading(true);           
            const client=await getClientById(item.id);
            navigation.navigate('InfoClient', { client: client });
        } catch (error) {
            console.log("Error al obtener detalle del cliente:", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <View style={styles.clientCard}>
            <TouchableOpacity 
                style={styles.mainInfo} 
                onPress={handlePress}
                activeOpacity={0.7}
                disabled={loading} 
            >
                <View style={styles.clientInfo}>
                    <View style={styles.avatar}>
                        <Users color={ColorPalette.primary} size={20} />
                    </View>
                    <View>
                        <Text style={styles.clientName}>{item.nombre}</Text>
                        <Text style={styles.clientEmail}>{item.telefono}</Text>
                    </View>
                </View>

                <View style={styles.clientAction}>
                    {loading ? (
                        <ActivityIndicator size="small" color={ColorPalette.primary} />
                    ) : (
                        <>
                            {item.sexo === "mujer" ? 
                                <Venus color='#f43799' size={20}/> : 
                                <Mars color='#2c1eed' size={20}/>
                            }
                            <ChevronRight color={ColorPalette.textSecondary} size={20} />
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    clientCard: {
        backgroundColor: ColorPalette.surface,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: ColorPalette.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    mainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: ColorPalette.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    clientName: {
        color: ColorPalette.textPrimary,
        fontWeight: '700',
        fontSize: 16,
    },
    clientEmail: {
        color: ColorPalette.textSecondary,
        fontSize: 13,
    },
    clientAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minWidth: 50, // Espacio para que el loader no mueva los iconos
        justifyContent: 'flex-end'
    },
});