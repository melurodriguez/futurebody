import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ColorPalette
    
 } from "../../theme";
export default function InputAction({ label, onPress, color }) {
  return (
    <TouchableOpacity 
      style={[styles.actionButton, { backgroundColor: color || ColorPalette.primary }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF', 
    fontWeight: 'bold',
    fontSize: 14,
  },
});