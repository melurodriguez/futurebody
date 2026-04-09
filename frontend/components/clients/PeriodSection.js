import { Text, StyleSheet } from "react-native";
import TrackCard from "./TrackCard";
import InputAction from "./InputAction";
import { ColorPalette } from "../../theme";

export default function PeriodSection({ onLogPeriod }) {
  return (
    <TrackCard title="Calendario Menstrual" icon="🩸">
      <Text style={styles.infoText}>
        Registra tu ciclo para ajustar tus macros y entrenamiento.
      </Text>
      <InputAction 
        label="Registrar día" 
        color={ColorPalette.accent} 
        onPress={onLogPeriod} 
      />
    </TrackCard>
  );
}

const styles = StyleSheet.create({
  infoText: {
    color: ColorPalette.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
});