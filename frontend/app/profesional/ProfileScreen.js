import React from 'react'
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { ColorPalette } from '../../theme'

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150' }} 
          style={styles.userImage}
        />

        <View style={styles.userInfoContainer}>
          <Text style={styles.name}>Juan Coach</Text>
          <Text style={styles.role}>Entrenador Personal</Text>
          <Text style={styles.email}>juan@email.com</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>Editar perfil</Text>
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Clientes</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Turnos semana</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <MenuItem title="Disponibilidad" />
        <MenuItem title="Servicios" />
        <MenuItem title="Notificaciones" />
        <MenuItem title="Seguridad" />
        <MenuItem title="Cerrar sesión" danger />
      </View>

    </View>
  )
}

export default ProfileScreen



const MenuItem = ({ title, danger }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={[styles.menuText, danger && { color: ColorPalette.error }]}>
      {title}
    </Text>
  </TouchableOpacity>
)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.background,
    padding: 20,
    marginVertical:15,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorPalette.surface,
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 2,
  },

  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },

  userInfoContainer: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorPalette.textPrimary,
  },

  role: {
    fontSize: 14,
    color: ColorPalette.primary,
    marginTop: 2,
  },

  email: {
    fontSize: 12,
    color: ColorPalette.textSecondary,
    marginTop: 2,
  },

  editButton: {
    backgroundColor: ColorPalette.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  editText: {
    color: '#FFF',
    fontWeight: '600',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  statBox: {
    width: '48%',
    backgroundColor: ColorPalette.surface,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorPalette.primary,
  },

  statLabel: {
    fontSize: 12,
    color: ColorPalette.textSecondary,
  },

  menu: {
    backgroundColor: ColorPalette.surface,
    borderRadius: 12,
    paddingVertical: 10,
  },

  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.border,
  },

  menuText: {
    fontSize: 14,
    color: ColorPalette.textPrimary,
  },
})