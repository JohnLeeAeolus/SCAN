import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ViewStyle, TextStyle, ImageStyle, ViewProps, TouchableOpacityProps } from 'react-native';

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

type UserData = {
    fullName?: string;
    name?: string;
    username?: string;
    bio?: string;
    profileImage?: string;
    avatar?: string;
    socialLinks?: SocialLink[];
    achievements?: Achievement[];
};

type ProfileScreenProps = {};

const ProfileScreen = ({ }: ProfileScreenProps) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
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
            // @ts-expect-error SafeAreaView type issue
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#7F5FFF" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        // @ts-expect-error SafeAreaView type issue
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
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
                    {/* @ts-expect-error TouchableOpacity type issue */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.headerIconBtn}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back-outline" size={24} color="#222" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={styles.headerIconBtn} />
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    {/* @ts-expect-error TouchableOpacity type issue */}
                    <TouchableOpacity activeOpacity={0.7}>
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

                {/* Section Card */}
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
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ marginRight: 6 }}>
                                    {getSocialLinkIcon(link.platform)}
                                </View>
                                <Text style={styles.socialLabel}>{link.label}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Achievements */}
                <Text style={styles.sectionTitle}>Achievements</Text>
                <View style={styles.achievementsRow}>
                    {user?.achievements?.map((achievement: Achievement, idx: number) => (
                        <View key={idx} style={styles.achievementCard}>
                            <View style={{ marginRight: 12 }}>
                                {getAchievementIcon(achievement.icon)}
                            </View>
                            <View style={{ marginLeft: 12 }}>
                                <View style={{ marginBottom: 2 }}>
                                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                                </View>
                                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    } as ViewStyle,
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    } as TextStyle,
    headerIconBtn: {
        padding: 4,
        width: 32,
    } as ViewStyle,
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
    } as ViewStyle,
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        marginBottom: 12,
    } as ImageStyle,
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 2,
    } as TextStyle,
    username: {
        fontSize: 15,
        color: '#888',
        marginBottom: 10,
    } as TextStyle,
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    } as ViewStyle,
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
    } as ViewStyle,
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    } as ViewStyle,
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#222',
    } as TextStyle,
    bioText: {
        color: '#444',
        fontSize: 15,
    } as TextStyle,
    socialLinksRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 18,
    } as ViewStyle,
    socialLink: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    } as ViewStyle,
    socialLabel: {
        marginLeft: 6,
        fontSize: 14,
        color: '#222',
    } as TextStyle,
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
    } as ViewStyle,
    achievementTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#222',
    } as TextStyle,
    achievementDesc: {
        color: '#888',
        fontSize: 13,
        marginTop: 2,
    } as TextStyle,
    achievementsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 18,
    } as ViewStyle,
}); 