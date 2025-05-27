import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const events = [
    {
        id: 1,
        date: '15',
        month: 'JUL',
        title: 'Congregation Meeting',
        desc: 'Regular weekly meeting at the Kingdom Hall.',
        time: '10:00 AM',
        status: 'Confirmed',
        statusColor: '#22C55E',
        avatars: [
            'https://randomuser.me/api/portraits/men/32.jpg',
            'https://randomuser.me/api/portraits/women/44.jpg',
        ],
        rsvp: false,
    },
    {
        id: 2,
        date: '22',
        month: 'JUL',
        title: 'Public Talk & Watchtower Study',
        desc: 'Special talk followed by Watchtower study.',
        time: '07:00 PM',
        status: 'RSVP Required',
        statusColor: '#FACC15',
        avatars: [
            'https://randomuser.me/api/portraits/men/45.jpg',
            'https://randomuser.me/api/portraits/women/46.jpg',
            'https://randomuser.me/api/portraits/men/47.jpg',
        ],
        rsvp: true,
    },
];

const announcements = [
    {
        id: 1,
        title: 'Reminder: Field Service Report Due',
        desc: 'Please submit your field service report by the end of the week.',
    },
    {
        id: 2,
        title: 'Cleaning Schedule Update',
        desc: 'New cleaning schedule for August is now available.',
    },
];

export default function ReportScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Events & Announcements</Text>
                </View>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                {events.map(event => (
                    <View key={event.id} style={styles.eventCard}>
                        <View style={styles.eventRow}>
                            <View style={styles.eventDateBox}>
                                <Text style={styles.eventDateNum}>{event.date}</Text>
                                <Text style={styles.eventDateMonth}>{event.month}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventDesc}>{event.desc}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    <Ionicons name="time-outline" size={16} color="#888" style={{ marginRight: 4 }} />
                                    <Text style={styles.eventTime}>{event.time}</Text>
                                </View>
                            </View>
                            <View style={[styles.eventStatusBadge, { backgroundColor: event.statusColor }]}>
                                <Text style={styles.eventStatusBadgeText}>{event.status}</Text>
                            </View>
                        </View>
                        <View style={styles.eventActionsRow}>
                            <View style={styles.avatarsRow}>
                                {event.avatars.map((uri, idx) => (
                                    <Image
                                        key={idx}
                                        source={{ uri }}
                                        style={[styles.avatar, { left: idx * -12 }]}
                                    />
                                ))}
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <TouchableOpacity style={styles.eventBtnOutline}>
                                    <Text style={styles.eventBtnOutlineText}>View Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.eventBtnFilled}>
                                    <Text style={styles.eventBtnFilledText}>RSVP</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
                <Text style={styles.sectionTitle}>Recent Announcements</Text>
                {announcements.map(ann => (
                    <View key={ann.id} style={styles.announcementCard}>
                        <View style={styles.announcementRow}>
                            <View style={styles.announcementIconBox}>
                                <Ionicons name="notifications-outline" size={28} color="#7F5FFF" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.announcementTitle}>{ann.title}</Text>
                                <Text style={styles.announcementDesc}>{ann.desc}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.announcementBtn}>
                            <Text style={styles.announcementBtnText}>Read More</Text>
                        </TouchableOpacity>
                    </View>
                ))}
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
        justifyContent: 'center',
        paddingTop: 18,
        paddingBottom: 8,
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
    eventCard: {
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
    eventRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    eventDateBox: {
        width: 44,
        alignItems: 'center',
        marginRight: 14,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingVertical: 4,
    },
    eventDateNum: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6366F1',
    },
    eventDateMonth: {
        fontSize: 12,
        color: '#888',
        fontWeight: 'bold',
    },
    eventTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    eventDesc: {
        fontSize: 13,
        color: '#888',
        marginBottom: 2,
    },
    eventTime: {
        fontSize: 13,
        color: '#888',
    },
    eventStatusBadge: {
        alignSelf: 'flex-start',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 8,
    },
    eventStatusBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    eventActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    avatarsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 2,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#fff',
        marginLeft: 12,
        position: 'relative',
    },
    eventBtnOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    eventBtnOutlineText: {
        color: '#7F5FFF',
        fontWeight: 'bold',
    },
    eventBtnFilled: {
        backgroundColor: '#7F5FFF',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    eventBtnFilledText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    announcementCard: {
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
    announcementRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    announcementIconBox: {
        width: 44,
        alignItems: 'center',
        marginRight: 14,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingVertical: 4,
        justifyContent: 'center',
    },
    announcementTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    announcementDesc: {
        fontSize: 13,
        color: '#888',
        marginBottom: 2,
    },
    announcementBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    announcementBtnText: {
        color: '#7F5FFF',
        fontWeight: 'bold',
    },
}); 