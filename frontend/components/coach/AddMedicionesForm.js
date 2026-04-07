import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';

export default function AddMedicionesForm({ onSubmit, onCancel, clienteId }) {
  const [form, setForm] = useState({
    peso: '',
    grasa: '',
    masa_muscular: '',
    altura: '',
    brazo: '',
    pecho: '',
    cintura: '',
    cadera: '',
    pierna: '',
  });

  const handleChange = (name, value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setForm({ ...form, [name]: numericValue });
  };

  const handleSave = () => {
    if (!form.peso) {
      return Alert.alert("Campo requerido", "El peso es obligatorio.");
    }

    const cleanedData = {
      cliente_id: clienteId, 
      peso: parseFloat(form.peso) || 0,
      grasa: parseFloat(form.grasa) || 0,
      masa_muscular: parseFloat(form.masa_muscular) || 0,
      altura: parseFloat(form.altura) || 0,
      brazo: parseFloat(form.brazo) || 0,
      pecho: parseFloat(form.pecho) || 0,
      cintura: parseFloat(form.cintura) || 0,
      cadera: parseFloat(form.cadera) || 0,
      pierna: parseFloat(form.pierna) || 0,
    };
    
    onSubmit(cleanedData);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Nueva Evaluación</Text>
          <Text style={styles.subtitle}>ID Cliente: {clienteId}</Text> 
        </View>

        {/* SECCIÓN 1: COMPOSICIÓN CORPORAL (2x2) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="activity" size={18} color={ColorPalette.primary} />
            <Text style={styles.sectionTitle}>Composición Corporal</Text>
          </View>
          
          <View style={styles.grid}>
            <InputBox 
              label="Peso (kg)" 
              value={form.peso} 
              onChangeText={(v) => handleChange('peso', v)} 
              placeholder="0.0"
              half
            />
            <InputBox 
              label="Altura (m)" 
              value={form.altura} 
              onChangeText={(v) => handleChange('altura', v)} 
              placeholder="0.0"
              half
            />
            <InputBox 
              label="Grasa (%)" 
              value={form.grasa} 
              onChangeText={(v) => handleChange('grasa', v)} 
              placeholder="0.0"
              half
            />
            <InputBox 
              label="Músculo (kg)" 
              value={form.masa_muscular} 
              onChangeText={(v) => handleChange('masa_muscular', v)} 
              placeholder="0.0"
              half
            />
          </View>
        </View>

        {/* SECCIÓN 2: MEDIDAS ANATÓMICAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="maximize" size={18} color={ColorPalette.primary} />
            <Text style={styles.sectionTitle}>Medidas Anatómicas (cm)</Text>
          </View>

          <View style={styles.grid}>
            <InputBox label="Pecho" value={form.pecho} onChangeText={(v) => handleChange('pecho', v)} half />
            <InputBox label="Cintura" value={form.cintura} onChangeText={(v) => handleChange('cintura', v)} half />
            <InputBox label="Brazo" value={form.brazo} onChangeText={(v) => handleChange('brazo', v)} half />
            <InputBox label="Cadera" value={form.cadera} onChangeText={(v) => handleChange('cadera', v)} half />
            <InputBox label="Pierna" value={form.pierna} onChangeText={(v) => handleChange('pierna', v)} half />
          </View>
        </View>

        {/* BOTONES */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Feather name="check" size={20} color="white" style={{marginRight: 8}} />
            <Text style={styles.saveButtonText}>Guardar Todo</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const InputBox = ({ label, value, onChangeText, placeholder, half = false }) => (
  <View style={[styles.inputWrapper, half ? { width: '48%' } : { width: '100%' }]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType="numeric"
      placeholder={placeholder || "0"}
      placeholderTextColor="#CBD5E1"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFBFE', padding: 20 },
  header: { marginBottom: 25 },
  title: { fontSize: 24, fontWeight: '800', color: ColorPalette.textPrimary },
  subtitle: { fontSize: 13, color: ColorPalette.textSecondary, fontWeight: '600' },
  section: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#F1F5F9' 
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: ColorPalette.textPrimary, textTransform: 'uppercase' },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    rowGap: 5 // Espacio vertical entre filas
  },
  inputWrapper: { marginBottom: 15 },
  label: { fontSize: 12, fontWeight: '600', color: ColorPalette.textSecondary, marginBottom: 6 },
  input: { 
    backgroundColor: '#F8FAFC', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    padding: 12, 
    fontSize: 16, 
    fontWeight: '700', 
    color: ColorPalette.textPrimary 
  },
  buttonContainer: { flexDirection: 'row', gap: 15, marginTop: 10 },
  cancelButton: { 
    flex: 1, 
    padding: 16, 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#F1F5F9' 
  },
  cancelButtonText: { color: ColorPalette.textSecondary, fontWeight: '700' },
  saveButton: { 
    flex: 2, 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: ColorPalette.primary 
  },
  saveButtonText: { color: 'white', fontWeight: '700', fontSize: 16 }
});