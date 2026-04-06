import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../theme';

const { width } = Dimensions.get('window');

const PopUps = ({ 
  visible, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  children 
}) => {
  
  const isError = type === 'error';
  const iconName = isError ? 'x-circle' : 'check-circle';
  const iconColor = isError ? '#EF4444' : '#10B981';

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Icono Principal */}
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
            <Feather name={iconName} size={40} color={iconColor} />
          </View>

          {/* Slot para Imagen Personalizada */}
          {children && <View style={styles.customImageSlot}>{children}</View>}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: iconColor }]} 
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  customImageSlot: {
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PopUps;