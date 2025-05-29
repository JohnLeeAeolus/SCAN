import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type DutyStatus = 'Assigned' | 'Pending' | 'Swap Requested' | 'Completed';

type Duty = {
    id: number;
    date: string;
    month: string;
    day: string;
    title: string;
    desc: string;
    role: string;
    time: string;
    status: DutyStatus;
    section: string;
    canConfirm: boolean;
    canSwap: boolean;
};

const duties: Duty[] = [
    {
        id: 1,
        date: '18',
        month: 'Nov',
        day: 'Monday',
        title: 'Public Talk',
        desc: 'Recording and sound setup',
        role: 'Sound Engineer',
        time: '7:00 PM',
        status: 'Assigned',
        section: 'This Week',
        canConfirm: true,
        canSwap: true,
    },
    {
        id: 2,
        date: '22',
        month: 'Nov',
        day: 'Friday',
        title: 'Meeting for Field Service',
        desc: 'Greeting and seating arrangement',
        role: 'Attendant',
        time: '9:30 AM',
        status: 'Pending',
        section: 'This Week',
        canConfirm: false,
        canSwap: true,
    },
    {
        id: 3,
        date: '25',
        month: 'Nov',
        day: 'Monday',
        title: 'Congregation Bible Study',
        desc: 'Platform setup and mic handling',
        role: 'Microphone Attendant',
        time: '7:00 PM',
        status: 'Swap Requested',
        section: 'This Week',
        canConfirm: false,
        canSwap: true,
    },
    {
        id: 4,
        date: '02',
        month: 'Dec',
        day: 'Monday',
        title: 'Theocratic Ministry School',
        desc: 'Stage backdrop arrangement',
        role: 'Stage Committee',
        time: '7:30 PM',
        status: 'Assigned',
        section: 'Next Week',
        canConfirm: true,
        canSwap: true,
    },
    {
        id: 5,
        date: '06',
        month: 'Dec',
        day: 'Friday',
        title: 'Meeting for Field Service',
        desc: 'Welcome and literature distribution',
        role: 'Literature Servant',
        time: '9:30 AM',
        status: 'Completed',
        section: 'Next Week',
        canConfirm: false,
        canSwap: false,
    },
];

const statusColors: Record<DutyStatus, string> = {
    Assigned: '#22C55E',
    Pending: '#EAB308',
    'Swap Requested': '#A78BFA',
    Completed: '#6B7280',
};

export default function ScheduleScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            // Add your schedule fetching logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchSchedule();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#7F5FFF" />
                </View>
            </SafeAreaView>
        );
    }

    const renderDutyCard = (duty: Duty) => (
        <View key={duty.id} style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.dateBox}>
                    <Text style={styles.dateNum}>{duty.date}</Text>
                    <Text style={styles.dateMonth}>{duty.month}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.dayText}>{duty.day}</Text>
                    <Text style={styles.dutyTitle}>{duty.title}</Text>
                    <Text style={styles.dutyDesc}>{duty.desc}</Text>
                    <Text style={styles.dutyRole}>{duty.role}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Ionicons name="time-outline" size={16} color="#888" style={{ marginRight: 4 }} />
                        <Text style={styles.dutyTime}>{duty.time}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColors[duty.status] || '#E5E7EB' }]}>
                    <Text style={styles.statusBadgeText}>{duty.status}</Text>
                </View>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionBtn, !duty.canConfirm && styles.actionBtnDisabled]}
                    disabled={!duty.canConfirm}
                >
                    <Text style={[styles.actionBtnText, !duty.canConfirm && styles.actionBtnTextDisabled]}>Confirm Duty</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, !duty.canSwap && styles.actionBtnDisabled]}
                    disabled={!duty.canSwap}
                >
                    <Text style={[styles.actionBtnText, !duty.canSwap && styles.actionBtnTextDisabled]}>Request Swap</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#7F5FFF']}
                        tintColor="#7F5FFF"
                    />
                }
            >
                <View style={styles.root}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Duty Schedule</Text>
                        <Ionicons name="notifications-outline" size={24} color="#222" />
                    </View>
                    <Text style={styles.sectionTitle}>This Week</Text>
                    {duties.filter(d => d.section === 'This Week').map(renderDutyCard)}
                    <Text style={styles.sectionTitle}>Next Week</Text>
                    {duties.filter(d => d.section === 'Next Week').map(renderDutyCard)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        padding: 18,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 18,
        marginBottom: 8,
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    dateBox: {
        width: 44,
        alignItems: 'center',
        marginRight: 14,
    },
    dateNum: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6366F1',
    },
    dateMonth: {
        fontSize: 13,
        color: '#888',
        fontWeight: 'bold',
    },
    dayText: {
        fontSize: 13,
        color: '#888',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    dutyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    dutyDesc: {
        fontSize: 13,
        color: '#888',
        marginBottom: 2,
    },
    dutyRole: {
        fontSize: 13,
        color: '#6366F1',
        textDecorationLine: 'underline',
        marginBottom: 2,
    },
    dutyTime: {
        fontSize: 13,
        color: '#888',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 8,
    },
    statusBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    actionBtn: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginLeft: 8,
    },
    actionBtnDisabled: {
        backgroundColor: '#E5E7EB',
    },
    actionBtnText: {
        color: '#222',
        fontWeight: 'bold',
    },
    actionBtnTextDisabled: {
        color: '#888',
    },
}); 