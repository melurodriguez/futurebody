import { View, StyleSheet } from "react-native";
import TrackCard from "./TrackCard";
import InputAction from "./InputAction";
import { ColorPalette } from "../../theme";

export default function MealSection({ onAddMeal }) { 
  return (
    <TrackCard title="Registro de Comidas" icon="🍽️">
      <View style={styles.mealGrid}>
        {['Desayuno', 'Almuerzo', 'Cena', 'Snack'].map((type) => (
          <View key={type} style={styles.buttonWrapper}>
            <InputAction 
              label={`+ ${type}`} 
              color={ColorPalette.primary} 
              onPress={() => onAddMeal(type)} 
            />
          </View>
        ))}
      </View>
    </TrackCard>
  );
}

const styles = StyleSheet.create({
  mealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    width: '48%',
    marginBottom: 12,
  }
});