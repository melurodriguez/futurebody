import React from 'react';
import { StyleSheet, TextInput, View } from "react-native";
import { Search } from 'lucide-react-native';
import { ColorPalette } from '../theme';

export default function SearchBar({ value, onChangeText, placeholder = "Buscar..." }) {
    return (
        <View style={styles.container}>
            <Search 
                size={20} 
                color="#020c1b" 
                style={styles.icon} 
                strokeWidth={1.5} 
            />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#64748b"
                value={value}
                onChangeText={onChangeText}
                cursorColor="#3B5BFF" // Tu Azul Eléctrico en el cursor (Android)
                selectionColor="#3B5BFF" // (iOS)
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ColorPalette.surface, // Fondo Dark
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: ColorPalette.border,
        marginVertical: 10,
        height: 50,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1, // Ocupa todo el espacio restante
        color: 'black',
        fontSize: 16,
        height: '100%',
    },
})