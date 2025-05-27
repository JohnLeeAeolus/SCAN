import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const placeholderAvatar = 'https://ui-avatars.com/api/?name=User&background=7F5FFF&color=fff&size=128';

const stats = {
    totalAttendance: 150,
    meetingsAttended: 8,
};

const events = [
    { icon: 'calendar', title: 'Service Meeting', time: 'Today, 7:30 PM' },
    { icon: 'bell', title: 'Special Talk Announcement', time: 'Tomorrow, 10:00 AM' },
    { icon: 'calendar', title: 'Public Talk', time: 'Sunday, 9:00 AM' },
];

export default function HomeScreen() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;
                const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                }
            } catch (error) {
                // Optionally handle error
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#7F5FFF" />
            </View>
        );
    }

    // The value to encode in the QR code (e.g., user UID or email)
    const qrValue = auth.currentUser?.uid || user?.email || 'No user';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ProfileScreen')}
                        activeOpacity={0.7}
                    >
                        <Image source={{ uri: user?.profileImage || user?.avatar || placeholderAvatar }} style={styles.headerAvatar} />
                    </TouchableOpacity>
                </View>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <Image source={{ uri: user?.profileImage || user?.avatar || placeholderAvatar }} style={styles.profileAvatar} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>{user?.fullName || user?.name || 'User'}</Text>
                        <Text style={styles.profileCong}>{user?.congregation || user?.congregation || ''}</Text>
                        <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>{user?.status || 'Active Member'}</Text></View>
                    </View>
                </View>
                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Attendance</Text>
                        <Text style={styles.statValue}>{stats.totalAttendance}</Text>
                        <Text style={styles.statSub}>Last 30 Days</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Meetings Attended</Text>
                        <Text style={styles.statValue}>{stats.meetingsAttended}</Text>
                        <Text style={styles.statSub}>This Month</Text>
                    </View>
                </View>
                {/* Attendance Trend (Mock Chart) */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Attendance Trend</Text>
                    <View style={styles.chartMock}>
                        {/* Replace with real chart later */}
                        <View style={styles.chartLine} />
                        <Text style={styles.chartLabels}>Jan   Feb   Mar   Apr   May   Jun</Text>
                    </View>
                </View>
                {/* QR Check-in/Check-out */}
                <View style={[styles.card, styles.qrCard]}>
                    <Text style={styles.qrTitle}>QR Check-in/Check-out</Text>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&h=256' }}
                        style={styles.qrImage}
                    />
                    <Text style={styles.qrDesc}>Scan the QR code at the hall entrance or display yours here.</Text>
                    <TouchableOpacity style={styles.qrButton} onPress={() => setQrModalVisible(true)}>
                        <Text style={styles.qrButtonText}>Show My QR Code</Text>
                    </TouchableOpacity>
                </View>
                {/* Upcoming Events */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Upcoming Events</Text>
                    {events.map((event, idx) => (
                        <View key={idx} style={styles.eventRow}>
                            <Ionicons
                                name={event.icon === 'bell' ? 'notifications-outline' : 'calendar-outline'}
                                size={20}
                                color="#7F5FFF"
                                style={{ marginRight: 8 }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventTime}>{event.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {/* QR Code Modal */}
            <Modal
                visible={qrModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setQrModalVisible(false)}
            >
                <View style={styles.qrModalOverlay}>
                    <View style={styles.qrModalContent}>
                        <Text style={styles.qrModalTitle}>Your QR Code</Text>
                        <QRCode value={qrValue} size={200} />
                        <Text style={styles.qrModalSubtitle}>{user?.fullName || user?.name || 'User'}</Text>
                        <TouchableOpacity style={styles.qrModalCloseBtn} onPress={() => setQrModalVisible(false)}>
                            <Text style={styles.qrModalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 18,
        paddingBottom: 90,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    profileAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 14,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileCong: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#E6E6FF',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginTop: 2,
    },
    statusBadgeText: {
        color: '#7F5FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    statLabel: {
        color: '#888',
        fontSize: 13,
        marginBottom: 2,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    },
    statSub: {
        color: '#888',
        fontSize: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chartMock: {
        height: 80,
        backgroundColor: '#E6E6FF',
        borderRadius: 8,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 8,
    },
    chartLine: {
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(127, 95, 255, 0.2)',
        borderRadius: 8,
        marginBottom: 4,
    },
    chartLabels: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    qrCard: {
        backgroundColor: '#7F5FFF',
        alignItems: 'center',
    },
    qrTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    qrImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginBottom: 10,
    },
    qrDesc: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    qrButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    qrButtonText: {
        color: '#7F5FFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingVertical: 10,
    },
    eventTitle: {
        fontSize: 15,
        fontWeight: '500',
    },
    eventTime: {
        color: '#888',
        fontSize: 13,
    },
    qrModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrModalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    qrModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 18,
        color: '#222',
    },
    qrModalSubtitle: {
        fontSize: 16,
        color: '#888',
        marginTop: 16,
        marginBottom: 8,
    },
    qrModalCloseBtn: {
        marginTop: 18,
        backgroundColor: '#7F5FFF',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 32,
    },
    qrModalCloseText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
}); 