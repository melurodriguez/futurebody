import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import SearchBar from "../../components/SearchBar";
import CreateUserModal from "../../components/coach/CreateUserModal";
import { ColorPalette } from '../../theme';
import ClientCard from '../../components/coach/ClientCard';

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

    const filteredClients = MOCK_CLIENTS.filter(client => 
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
    );

    const renderClient = ({ item }) => (
        <ClientCard item={item}/>
    );

    return (
        <View style={styles.container}>
            <SearchBar 
                value={search} 
                onChangeText={(text) => setSearch(text)} 
                placeholder="Buscar por nombre o email..." 
            />

            <FlatList
                data={filteredClients}
                keyExtractor={item => item.id}
                renderItem={renderClient}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No se encontraron clientes.</Text>
                }
            />

            {/* Botón flotante para abrir el Modal que creamos antes */}
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.fabText}>+</Text>
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
        backgroundColor: ColorPalette.background, // Tu fondo Dark
        paddingHorizontal: 16,
        paddingTop: 10,
    },
   
    emptyText: {
        color: '#64748b',
        textAlign: 'center',
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#3B5BFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#3B5BFF',
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    fabText: {
        color: 'white',
        fontSize: 30,
        lineHeight: 34,
    }
});