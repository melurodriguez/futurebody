import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import SearchBar from "../../components/SearchBar";
import CreateUserModal from "../../components/coach/CreateUserModal";
import { ColorPalette } from '../../theme';
import ClientCard from '../../components/coach/ClientCard';
import { Feather } from '@expo/vector-icons';
import { useClientStore } from '../../apis/coach/useClientsStore';

const MOCK_CLIENTS = [
    { id: '1', name: 'Juan Pérez', email: 'juan@fit.com', plan: 'Premium' },
    { id: '2', name: 'María García', email: 'maria@fit.com', plan: 'Basic' },
    { id: '3', name: 'Carlos Ruiz', email: 'cruiz@fit.com', plan: 'Premium' },
    { id: '4', name: 'Ana Sosa', email: 'asosa@fit.com', plan: 'Personalized' },
    { id: '5', name: 'Roberto Gómez', email: 'robert@fit.com', plan: 'Basic' },
];

export default function ClientsScreen() {
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    // 1. Extraemos lo que necesitamos del store
    const { clients, getClients, error } = useClientStore();

    // 2. Cargamos los datos al montar la pantalla
    useEffect(() => {
        getClients();
    }, []);

    // 3. Filtramos sobre los datos que vienen del store
    const filteredClients = clients.filter(client => 
        client.nombre?.toLowerCase().includes(search.toLowerCase()) // Cambiado a 'nombre'
    );

    const renderClient = ({ item }) => (
        <ClientCard item={item}/>
    );

    return (
        <View style={styles.container}>
            {/* Título de sección para consistencia con Stats */}
            <Text style={styles.headerTitle}>Mis Clientes</Text>

            <SearchBar 
                value={search} 
                onChangeText={(text) => setSearch(text)} 
                placeholder="Buscar por nombre o email..." 
                // Asegúrate que tu componente SearchBar use ColorPalette internamente
            />

            <FlatList
                data={filteredClients}
                keyExtractor={item => item.id}
                renderItem={renderClient}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="users" size={40} color={ColorPalette.textMuted} />
                        <Text style={styles.emptyText}>No se encontraron clientes.</Text>
                    </View>
                }
            />

            {/* FAB con estilo Lila y Sombra Suave */}
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <Feather name="plus" size={28} color="white" />
            </TouchableOpacity>

            <CreateUserModal 
                visible={modalVisible} 
                onClose={() => setModalVisible(false)} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorPalette.background,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: ColorPalette.textPrimary,
        marginTop: 60,
        marginBottom: 10,
    },
    listContent: { 
        paddingTop: 10,
        paddingBottom: 100 
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: ColorPalette.textSecondary,
        textAlign: 'center',
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: ColorPalette.primary, // Ahora es el lila #7C3AED
        width: 60,
        height: 60,
        borderRadius: 20, // Forma Squircle/Moderna en lugar de círculo perfecto
        justifyContent: 'center',
        alignItems: 'center',
        // Sombra estilizada
        elevation: 5,
        shadowColor: ColorPalette.primary,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    }
});