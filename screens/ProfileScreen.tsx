import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const placeholderAvatar = 'https://ui-avatars.com/api/?name=User&background=7F5FFF&color=fff&size=128';

type MainTabsParamList = {
    Dashboard: undefined;
    DutySchedule: undefined;
    Events: undefined;
    Profile: undefined;
};

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<BottomTabNavigationProp<MainTabsParamList>>();

    // Placeholder data for demo
    const followers = 2500;
    const following = 320;
    const bio =
        'Passionate designer and photographer sharing my creative journey. Exploring the intersection of art and technology. Love capturing moments that tell a story.';
    const socialLinks = [
        { icon: <FontAwesome name="twitter" size={16} color="#1DA1F2" />, label: '@janedoe_design', color: '#E6F4FD' },
        { icon: <FontAwesome name="linkedin" size={16} color="#0A66C2" />, label: '/in/janedoecreative', color: '#E6F0FA' },
        { icon: <MaterialCommunityIcons name="web" size={16} color="#A259FF" />, label: 'janedoe.design', color: '#F3E6FF' },
        { icon: <FontAwesome5 name="github" size={16} color="#333" />, label: 'janedoe-dev', color: '#F0F0F0' },
    ];
    const achievements = [
        {
            icon: <Ionicons name="ribbon-outline" size={20} color="#7F5FFF" />,
            title: 'Top Contributor',
            desc: 'Recognized for outstanding contributions in the community.',
        },
        {
            icon: <Ionicons name="bulb-outline" size={20} color="#7F5FFF" />,
            title: 'Creative Pioneer',
            desc: 'Awarded for innovative design work.',
        },
    ];

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

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 20 }}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBtn}>
                    <Ionicons name="arrow-back-outline" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.headerIconBtn}>
                    <Ionicons name="notifications-outline" size={24} color="#222" />
                </TouchableOpacity>
            </View>
            {/* Modal Menu */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
                    <View style={styles.menuModal}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setModalVisible(false); }}>
                            <Ionicons name="notifications-outline" size={20} color="#7F5FFF" style={{ marginRight: 10 }} />
                            <Text style={styles.menuText}>Notifications</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setModalVisible(false); navigation.navigate('Dashboard'); }}>
                            <Ionicons name="home-outline" size={20} color="#7F5FFF" style={{ marginRight: 10 }} />
                            <Text style={styles.menuText}>Go to Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setModalVisible(false); navigation.navigate('Profile'); }}>
                            <Ionicons name="settings-outline" size={20} color="#7F5FFF" style={{ marginRight: 10 }} />
                            <Text style={styles.menuText}>Go to Settings</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
            {/* Profile Card */}
            <View style={styles.profileCard}>
                <Image source={{ uri: user?.profileImage || user?.avatar || placeholderAvatar }} style={styles.avatar} />
                <Text style={styles.name}>{user?.fullName || user?.name || 'Jane Doe'}</Text>
                <Text style={styles.username}>@{user?.username || 'janedoe'}</Text>
                <View style={styles.divider} />
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{followers}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{following}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>
            </View>
            {/* Bio Section */}
            <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Bio</Text>
                    <Ionicons name="chevron-forward-outline" size={18} color="#888" />
                </View>
                <Text style={styles.bioText}>{user?.bio || bio}</Text>
            </View>
            {/* Social Links */}
            <Text style={styles.sectionTitle}>Social Links</Text>
            <View style={styles.socialLinksRow}>
                {socialLinks.map((link, idx) => (
                    <View key={idx} style={[styles.socialLink, { backgroundColor: link.color }]}>
                        {link.icon}
                        <Text style={styles.socialLabel}>{link.label}</Text>
                    </View>
                ))}
            </View>
            {/* Achievements */}
            <Text style={styles.sectionTitle}>Achievements</Text>
            {achievements.map((ach, idx) => (
                <View key={idx} style={styles.achievementCard}>
                    {ach.icon}
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.achievementTitle}>{ach.title}</Text>
                        <Text style={styles.achievementDesc}>{ach.desc}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    },
    headerIconBtn: {
        padding: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    menuModal: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 48,
        marginRight: 16,
        paddingVertical: 8,
        width: 200,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 15,
        color: '#222',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        marginBottom: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 2,
    },
    username: {
        fontSize: 15,
        color: '#888',
        marginBottom: 10,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    statLabel: {
        color: '#888',
        fontSize: 13,
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#222',
    },
    bioText: {
        color: '#444',
        fontSize: 15,
    },
    socialLinksRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 18,
    },
    socialLink: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    socialLabel: {
        marginLeft: 6,
        fontSize: 14,
        color: '#222',
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    achievementTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#222',
    },
    achievementDesc: {
        color: '#888',
        fontSize: 13,
        marginTop: 2,
    },
}); 