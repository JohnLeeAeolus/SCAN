import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Modal, TextInput, Alert, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const placeholderAvatar = 'https://ui-avatars.com/api/?name=User&background=7F5FFF&color=fff&size=128';

type MainTabsParamList = {
    Dashboard: undefined;
    DutySchedule: undefined;
    Events: undefined;
    Profile: undefined;
};

type SocialLink = {
    platform: string;
    icon: string;
    label: string;
    color: string;
};

type Achievement = {
    icon: string;
    title: string;
    desc: string;
};

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<BottomTabNavigationProp<MainTabsParamList>>();

    const fetchUser = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUser(data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch user data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        // Set up real-time listener
        const unsubscribe = onSnapshot(
            doc(firestore, 'users', currentUser.uid),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setUser(data);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error listening to user data:", error);
                Alert.alert('Error', 'Failed to sync user data');
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchUser();
    }, []);

    const getSocialLinkIcon = (platform: string) => {
        switch (platform) {
            case 'twitter':
                return <FontAwesome name="twitter" size={16} color="#1DA1F2" />;
            case 'linkedin':
                return <FontAwesome name="linkedin" size={16} color="#0A66C2" />;
            case 'web':
                return <MaterialCommunityIcons name="web" size={16} color="#A259FF" />;
            case 'github':
                return <FontAwesome5 name="github" size={16} color="#333" />;
            default:
                return <Ionicons name="link" size={16} color="#666" />;
        }
    };

    const getAchievementIcon = (iconName: string) => {
        switch (iconName) {
            case 'ribbon':
                return <Ionicons name="ribbon-outline" size={20} color="#7F5FFF" />;
            case 'bulb':
                return <Ionicons name="bulb-outline" size={20} color="#7F5FFF" />;
            default:
                return <Ionicons name="star-outline" size={20} color="#7F5FFF" />;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#7F5FFF" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView
                contentContainerStyle={{ padding: 20 }}
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
                    <TouchableOpacity>
                        <Image
                            source={{ uri: user?.profileImage || user?.avatar || placeholderAvatar }}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <Text style={styles.name}>{user?.fullName || user?.name || 'Jane Doe'}</Text>
                    </View>
                    <Text style={styles.username}>@{user?.username || 'janedoe'}</Text>
                </View>
                {/* Bio Section */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Bio</Text>
                    </View>
                    <Text style={styles.bioText}>{user?.bio || 'No bio added yet.'}</Text>
                </View>
                {/* Social Links */}
                <Text style={styles.sectionTitle}>Social Links</Text>
                <View style={styles.socialLinksRow}>
                    {user?.socialLinks?.map((link: SocialLink, idx: number) => (
                        <View key={idx} style={[styles.socialLink, { backgroundColor: link.color }]}>
                            {getSocialLinkIcon(link.platform)}
                            <Text style={styles.socialLabel}>{link.label}</Text>
                        </View>
                    ))}
                </View>
                {/* Achievements */}
                <Text style={styles.sectionTitle}>Achievements</Text>
                {user?.achievements?.map((achievement: Achievement, idx: number) => (
                    <View key={idx} style={styles.achievementCard}>
                        {getAchievementIcon(achievement.icon)}
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.achievementTitle}>{achievement.title}</Text>
                            <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
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