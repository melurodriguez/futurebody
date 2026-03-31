import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Users, ChevronRight } from 'lucide-react-native';
import { ColorPalette } from "../../theme";

export default function ClientCard({item}) {
    return(
        <TouchableOpacity style={styles.clientCard}>
            <View style={styles.clientInfo}>
                <View style={styles.avatar}>
                    <Users color="#3B5BFF" size={20} />
                </View>
                <View>
                    <Text style={styles.clientName}>{item.name}</Text>
                    <Text style={styles.clientEmail}>{item.email}</Text>
                </View>
            </View>
            <View style={styles.clientAction}>
                <Text style={styles.planBadge}>{item.plan}</Text>
                <ChevronRight color="#475569" size={20} />
            </View>
        </TouchableOpacity>
    )
}

const styles=StyleSheet.create({
     clientCard: {
        flexDirection: 'row',
        backgroundColor: ColorPalette.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: ColorPalette.border,
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: ColorPalette.gradient,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    clientName: {
        color: '#000221',
        fontWeight: '600',
        fontSize: 16,
    },
    clientEmail: {
        color: '#94a3b8',
        fontSize: 13,
    },
    clientAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    planBadge: {
        backgroundColor: '#a6bdf3',
        color: '#4d09b4',
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 8,
        overflow: 'hidden',
    },
})