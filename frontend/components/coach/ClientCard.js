import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Users, Venus, Mars, ChevronDown, ChevronUp } from 'lucide-react-native';
import { ColorPalette } from "../../theme";
import ClientInfoScreen from '../../screens/coach/ClientInfoScreen';

export default function ClientCard({ item }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={styles.clientCard}>
            <TouchableOpacity 
                style={styles.mainInfo} 
                onPress={() => setIsOpen(!isOpen)}
                activeOpacity={0.7}
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
                    {item.sexo === "mujer" ? <Venus color='#f43799' size={20}/> : <Mars color='#2c1eed' size={20}/>}
                    {isOpen ? <ChevronUp color="#494769" size={20} /> : <ChevronDown color="#494769" size={20} />}
                </View>
            </TouchableOpacity>

            {/* Si está abierto, mostramos la info detallada */}
            {isOpen && (
                <ClientInfoScreen client={item} />
            )}
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
        // Sombra suave
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
        gap: 8
    },
});