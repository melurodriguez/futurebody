import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../apis/useAuthStore';
import { useClientStore } from '../../apis/coach/useClientsStore';
import PeriodSection from '../../components/clients/PeriodSection';
import MealSection from '../../components/clients/MealSection';
import { ColorPalette } from '../../theme';

export default function SeguimientoScreen() {
    const user = useAuthStore((state) => state.user);
    const { currentCliente, fetchCurrentCliente, loading } = useClientStore();

    useEffect(() => {
        if (user?.id && !currentCliente) {
            fetchCurrentCliente(user.id);
        }
    }, [user?.id, currentCliente]);

    const esMujer = currentCliente?.sexo?.toLowerCase() === 'mujer';

    const handleAddMeal = (tipo) => console.log(`Registrando comida: ${tipo}`);
    const handlePeriodLog = () => console.log('Día de periodo registrado en FutureBody');

    if (loading && !currentCliente) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={ColorPalette.primary} />
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.header}>Tu Seguimiento</Text>
            
            <MealSection onAddMeal={handleAddMeal} />

            {esMujer && (
                <PeriodSection onLogPeriod={handlePeriodLog} />
            )}
            
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorPalette.background,
    },
    contentContainer: {
        padding: 20,
        paddingTop: 60, 
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: '800',
        color: ColorPalette.textPrimary,
        marginBottom: 24,
        letterSpacing: -0.5,
    },
});