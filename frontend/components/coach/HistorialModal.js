import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Dimensions ,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';

const { height } = Dimensions.get('window');

export default function HistorialModal({ visible, onClose, onDelete,mediciones, medidasCorporales }) {

    const confirmDelete = (item, detalleCuerpo) => {
        Alert.alert(
            "Eliminar Registro",
            "¿Estás seguro de que deseas eliminar esta evaluación? Esta acción no se puede deshacer.",
            [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Eliminar", 
                style: "destructive", 
                onPress: () => onDelete(item.id, detalleCuerpo?.id) 
            }
            ]
        );
    };
  
  const renderMedicionItem = ({ item, index }) => {
    const anterior = index > 0 ? mediciones[index - 1] : null;
    console.log("MEDICIONES: ", mediciones)
    console.log("MEDIDAS: ", medidasCorporales)    

    const detalleCuerpo = medidasCorporales?.find(m => 
      m.fecha.split('T')[0] === item.fecha.split('T')[0]
    );
    
    return (
      <View style={styles.historyCard}>
        {/* HEADER */}
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.dateBadge}>
              <Feather name="calendar" size={12} color={ColorPalette.primary} />
              <Text style={styles.dateText}>
                {new Date(item.fecha).toLocaleDateString('es-ES', { 
                  day: '2-digit', month: 'short', year: 'numeric' 
                })}
              </Text>
            </View>

            {/* Lógica: Si el índice es el último de la lista, es la más reciente */}
            {index === 0 && (
              <View style={styles.latestBadge}>
                <Text style={styles.latestText}>Última</Text>
              </View>
            )}
          </View>

          {/* BOTÓN ELIMINAR */}
          <TouchableOpacity 
            onPress={() => confirmDelete(item, detalleCuerpo)}
            style={styles.deleteButton}
          >
            <Feather name="trash-2" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* MÉTRICAS PRINCIPALES */}
        <View style={styles.metricsRow}>
          {/* Ahora comparamos contra index - 1 */}
          <HistoryMetric label="Peso" value={item.peso} unit="kg" prev={anterior?.peso} inverse/>
          <HistoryMetric label="Grasa" value={item.grasa} unit="%" prev={anterior?.grasa} inverse />
          <HistoryMetric label="Músculo" value={item.masa_muscular} unit="%" prev={anterior?.masa_muscular} />
          <HistoryMetric label="Altura" value={item.altura} unit="m" prev={anterior?.altura} />
        </View>

        {/* SECCIÓN DETALLE CORPORAL */}
        {detalleCuerpo && (
          <View style={styles.bodyDetailsContainer}>
            <View style={styles.divider} />
            <Text style={styles.detailsTitle}>Medidas Anatómicas (cm)</Text>
            <View style={styles.detailsGrid}>
              <DetailItem label="Brazo" value={detalleCuerpo.brazo} />
              <DetailItem label="Pecho" value={detalleCuerpo.pecho} />
              <DetailItem label="Cintura" value={detalleCuerpo.cintura} />
              <DetailItem label="Cadera" value={detalleCuerpo.cadera} />
              <DetailItem label="Pierna" value={detalleCuerpo.pierna} />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <View style={styles.header}>
            <Text style={styles.title}>Historial de Evolución</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={20} color={ColorPalette.textPrimary} />
            </TouchableOpacity>
          </View>

          {mediciones && mediciones.length > 0 ? (
            <FlatList
              data={mediciones}
              renderItem={renderMedicionItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={50} color={ColorPalette.border} />
              <Text style={styles.emptyText}>No hay registros todavía</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// Componentes internos
const DetailItem = ({ label, value }) => (
  <View style={styles.detailBox}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || '--'}</Text>
  </View>
);

const HistoryMetric = ({ label, value, unit, prev, inverse = false }) => {
  const diff = prev ? (value - prev).toFixed(1) : null;
  const isPositive = diff > 0;
  const getTrendColor = () => {
    if (!diff || diff == 0) return ColorPalette.textSecondary;
    if (inverse) return isPositive ? '#EF4444' : '#10B981';
    return isPositive ? '#10B981' : '#EF4444';
  };

  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}{unit}</Text>
      {diff !== null && (
        <View style={styles.trendRow}>
          <Feather name={isPositive ? "trending-up" : "trending-down"} size={10} color={getTrendColor()} />
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {isPositive ? `+${diff}` : diff}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FBFBFE', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: height * 0.85, padding: 20 },
  modalHandle: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 10, alignSelf: 'center', marginBottom: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: ColorPalette.textPrimary },
  closeButton: { backgroundColor: '#F1F5F9', padding: 8, borderRadius: 12 },
  listContainer: { paddingBottom: 40 },
  historyCard: { backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  dateBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: ColorPalette.secondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  dateText: { fontSize: 12, fontWeight: '700', color: ColorPalette.primary },
  latestBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  latestText: { fontSize: 10, fontWeight: '800', color: '#10B981', textTransform: 'uppercase' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  metricBox: { alignItems: 'center', flex: 1 },
  metricLabel: { fontSize: 11, color: ColorPalette.textSecondary, marginBottom: 4 },
  metricValue: { fontSize: 16, fontWeight: '800', color: ColorPalette.textPrimary },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  trendText: { fontSize: 10, fontWeight: 'bold' },
  
  // Estilos Medidas Anatómicas
  bodyDetailsContainer: { marginTop: 10 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  detailsTitle: { fontSize: 10, fontWeight: '800', color: ColorPalette.textSecondary, marginBottom: 10, textTransform: 'uppercase' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  detailBox: { backgroundColor: '#F8FAFC', padding: 8, borderRadius: 10, width: '18%', alignItems: 'center' },
  detailLabel: { fontSize: 9, color: ColorPalette.textSecondary, marginBottom: 2 },
  detailValue: { fontSize: 12, fontWeight: '700', color: ColorPalette.textPrimary },
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyText: { color: ColorPalette.textSecondary, fontWeight: '600' },
  // NUEVO ESTILO PARA EL BOTÓN DE ELIMINAR
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
  },
});