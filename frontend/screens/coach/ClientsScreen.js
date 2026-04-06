import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import SearchBar from "../../components/SearchBar";
import CreateUserModal from "../../components/coach/CreateUserModal";
import { ColorPalette } from '../../theme';
import ClientCard from '../../components/coach/ClientCard';
import { Feather } from '@expo/vector-icons';
import { useClientStore } from '../../apis/coach/useClientsStore';


export default function ClientsScreen() {
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const { clients, getClients, error } = useClientStore();

    useEffect(() => {
        getClients();
    }, []);

    const filteredClients = clients.filter(client => 
        client.nombre?.toLowerCase().includes(search.toLowerCase()) // Cambiado a 'nombre'
    );

    const renderClient = ({ item }) => (
        <ClientCard item={item}/>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Mis Clientes</Text>

            <SearchBar 
                value={search} 
                onChangeText={(text) => setSearch(text)} 
                placeholder="Buscar por nombre o email..." 
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
        backgroundColor: ColorPalette.primary,
        width: 60,
        height: 60,
        borderRadius: 20, 
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