import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image, ActivityIndicator, Alert, TextInput, Modal, Platform, Animated, Easing, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import * as ImagePicker from 'expo-image-picker';
import { updatePassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

// Update the EditModal component with better UI
function EditModal({ visible, onClose, onSave, title, value, onChangeText, isPassword, isAvatar, saving, avatarLoading }: any) {
    const [localValue, setLocalValue] = useState(value);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const scale = React.useRef(new Animated.Value(0.9)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setLocalValue(value);
        setPassword('');
        setConfirmPassword('');
    }, [value]);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 15,
                    mass: 1,
                    stiffness: 150,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(scale, {
                    toValue: 0.9,
                    useNativeDriver: true,
                    damping: 15,
                    mass: 1,
                    stiffness: 150,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleSave = () => {
        if (isPassword) {
            onSave(password, confirmPassword);
        } else {
            onSave(localValue);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View
                style={[
                    styles.modalOverlay,
                    { opacity }
                ]}
            >
                <TouchableOpacity
                    style={styles.modalOverlayTouchable}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                transform: [{ scale }],
                                opacity,
                            }
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            {isPassword ? (
                                <>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="New Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        autoCapitalize="none"
                                        placeholderTextColor="#999"
                                    />
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        autoCapitalize="none"
                                        placeholderTextColor="#999"
                                    />
                                </>
                            ) : isAvatar ? (
                                <TouchableOpacity
                                    style={[styles.modalButton, { marginBottom: 0 }]}
                                    onPress={handleSave}
                                    disabled={avatarLoading}
                                >
                                    <Text style={styles.modalButtonText}>
                                        {avatarLoading ? 'Uploading...' : 'Pick New Photo'}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TextInput
                                    style={styles.modalInput}
                                    value={localValue}
                                    onChangeText={setLocalValue}
                                    editable={!saving}
                                    autoFocus
                                    autoCapitalize="none"
                                    placeholderTextColor="#999"
                                />
                            )}
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                onPress={onClose}
                                style={[styles.modalButton, styles.modalButtonSecondary]}
                            >
                                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={saving || avatarLoading}
                                style={[
                                    styles.modalButton,
                                    styles.modalButtonPrimary,
                                    (saving || avatarLoading) && styles.modalButtonDisabled
                                ]}
                            >
                                <Text style={styles.modalButtonText}>
                                    {saving ? 'Saving...' : 'Save'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
    );
}

// Add ProfileImageModal component at the top level
function ProfileImageModal({ visible, imageUrl, onClose }: { visible: boolean; imageUrl: string; onClose: () => void }) {
    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.profileImageModalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.profileImageModal}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </Modal>
    );
}

// Update TwoFAModal component to use props
function TwoFAModal({
    visible,
    onClose,
    onConfirm,
    isEnable,
    saving
}: {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isEnable: boolean;
    saving: boolean;
}) {
    if (!visible) return null;
    return (
        <Modal transparent visible animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {isEnable ? 'Enable Two-Factor Authentication' : 'Disable Two-Factor Authentication'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBody}>
                        <Text style={{ color: '#444', marginBottom: 18 }}>
                            {isEnable
                                ? 'Two-factor authentication adds an extra layer of security. You will receive further instructions via email.'
                                : 'Are you sure you want to disable two-factor authentication?'}
                        </Text>
                    </View>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.modalButton, styles.modalButtonSecondary]}
                        >
                            <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onConfirm}
                            disabled={saving}
                            style={[styles.modalButton, styles.modalButtonPrimary, saving && styles.modalButtonDisabled]}
                        >
                            <Text style={styles.modalButtonText}>{isEnable ? 'Enable' : 'Disable'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function SocialLinksModal({
    visible,
    onClose,
    onSave,
    user,
    saving
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (socialLinks: Array<{ platform: string, label: string, color: string }>) => void;
    user: any;
    saving: boolean;
}) {
    const [socialLinksDraft, setSocialLinksDraft] = useState<Array<{ platform: string, label: string, color: string }>>(user?.socialLinks || []);
    const [newPlatform, setNewPlatform] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [newColor, setNewColor] = useState('#E6F4FD');

    useEffect(() => {
        if (visible) {
            setSocialLinksDraft(user?.socialLinks || []);
            setNewPlatform('');
            setNewLabel('');
            setNewColor('#E6F4FD');
        }
    }, [visible, user]);

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'twitter': return '#E6F4FD';
            case 'linkedin': return '#E6F0FA';
            case 'web': return '#F3E6FF';
            case 'github': return '#F0F0F0';
            default: return '#F5F5F5';
        }
    };

    const handleAddSocialLink = () => {
        if (newPlatform.trim() && newLabel.trim()) {
            const color = getPlatformColor(newPlatform.trim());
            setSocialLinksDraft([...socialLinksDraft, {
                platform: newPlatform.trim(),
                label: newLabel.trim(),
                color
            }]);
            setNewPlatform('');
            setNewLabel('');
            setNewColor('#E6F4FD');
        }
    };

    const handleRemoveSocialLink = (index: number) => {
        setSocialLinksDraft(socialLinksDraft.filter((_, idx) => idx !== index));
    };

    const handleSave = () => {
        onSave(socialLinksDraft);
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={true} animationType="none">
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Edit Social Links</Text>
                    <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                    {socialLinksDraft.map((link, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#222', fontWeight: '500' }}>{link.platform}</Text>
                                <Text style={{ color: '#666' }}>{link.label}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleRemoveSocialLink(idx)}>
                                <Ionicons name="close-circle-outline" size={20} color="#E57373" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={{ marginTop: 16 }}>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Platform (twitter, linkedin, web, github)"
                            value={newPlatform}
                            onChangeText={setNewPlatform}
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Label (e.g., @username)"
                            value={newLabel}
                            onChangeText={setNewLabel}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                            onPress={handleAddSocialLink}
                            disabled={!newPlatform.trim() || !newLabel.trim()}
                            style={[
                                styles.modalButton,
                                styles.modalButtonPrimary,
                                (!newPlatform.trim() || !newLabel.trim()) && styles.modalButtonDisabled
                            ]}
                        >
                            <Text style={styles.modalButtonText}>Add Link</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.modalButton, styles.modalButtonSecondary]}
                    >
                        <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={saving}
                        style={[styles.modalButton, styles.modalButtonPrimary, saving && styles.modalButtonDisabled]}
                    >
                        <Text style={styles.modalButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

// Achievements Modal
function AchievementsModal({
    visible,
    onClose,
    onSave,
    user,
    saving
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (achievements: Array<{ icon: string, title: string, desc: string }>) => void;
    user: any;
    saving: boolean;
}) {
    const [achievementsDraft, setAchievementsDraft] = useState<Array<{ icon: string, title: string, desc: string }>>(user?.achievements || []);
    const [newIcon, setNewIcon] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    useEffect(() => {
        if (visible) {
            setAchievementsDraft(user?.achievements || []);
            setNewIcon('');
            setNewTitle('');
            setNewDesc('');
        }
    }, [visible, user]);

    const handleAddAchievement = () => {
        if (newIcon.trim() && newTitle.trim() && newDesc.trim()) {
            setAchievementsDraft([...achievementsDraft, {
                icon: newIcon.trim(),
                title: newTitle.trim(),
                desc: newDesc.trim()
            }]);
            setNewIcon('');
            setNewTitle('');
            setNewDesc('');
        }
    };

    const handleRemoveAchievement = (index: number) => {
        setAchievementsDraft(achievementsDraft.filter((_, idx) => idx !== index));
    };

    const handleSave = () => {
        onSave(achievementsDraft);
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={true} animationType="none">
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Edit Achievements</Text>
                    <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                    {achievementsDraft.map((achievement, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#222', fontWeight: '500' }}>{achievement.title}</Text>
                                <Text style={{ color: '#666' }}>{achievement.desc}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleRemoveAchievement(idx)}>
                                <Ionicons name="close-circle-outline" size={20} color="#E57373" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={{ marginTop: 16 }}>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Icon (ribbon, bulb, star)"
                            value={newIcon}
                            onChangeText={setNewIcon}
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Title"
                            value={newTitle}
                            onChangeText={setNewTitle}
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Description"
                            value={newDesc}
                            onChangeText={setNewDesc}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                            onPress={handleAddAchievement}
                            disabled={!newIcon.trim() || !newTitle.trim() || !newDesc.trim()}
                            style={[
                                styles.modalButton,
                                styles.modalButtonPrimary,
                                (!newIcon.trim() || !newTitle.trim() || !newDesc.trim()) && styles.modalButtonDisabled
                            ]}
                        >
                            <Text style={styles.modalButtonText}>Add Achievement</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.modalButton, styles.modalButtonSecondary]}
                    >
                        <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={saving}
                        style={[styles.modalButton, styles.modalButtonPrimary, saving && styles.modalButtonDisabled]}
                    >
                        <Text style={styles.modalButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeModal, setActiveModal] = useState<null | 'nickname' | 'fullname' | 'password' | 'avatar' | 'bio' | 'local' | 'status' | 'socialLinks' | 'callSign' | 'duty' | 'defaultLocation' | 'achievements'>(null);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [twoFAAction, setTwoFAAction] = useState<'enable' | 'disable' | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<string | null>(null);
    const [modalValue, setModalValue] = useState('');
    const [showProfileImage, setShowProfileImage] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const fetchUser = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUser(data);
                setPushNotifications(!!data.pushNotifications);
                setEmailNotifications(!!data.emailNotifications);
                setTwoFactor(!!data.twoFactor);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            Alert.alert('Error', 'Failed to fetch user data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUser();
    }, []);

    const handleToggle = async (key: string, value: boolean) => {
        setSaving(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            await updateDoc(doc(firestore, 'users', currentUser.uid), {
                [key]: value,
            });
            if (key === 'pushNotifications') setPushNotifications(value);
            if (key === 'emailNotifications') setEmailNotifications(value);
            if (key === 'twoFactor') setTwoFactor(value);
        } catch (error) {
            Alert.alert('Error', 'Failed to update setting.');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleTwoFactor = (value: boolean) => {
        setTwoFAAction(value ? 'enable' : 'disable');
        setShow2FAModal(true);
    };

    const handleConfirm2FA = async () => {
        setSaving(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('No user');
            await updateDoc(doc(firestore, 'users', currentUser.uid), { twoFactor: twoFAAction === 'enable' });
            setTwoFactor(twoFAAction === 'enable');
            setShow2FAModal(false);
            setTwoFAAction(null);
            if (twoFAAction === 'enable') {
                Alert.alert('2FA Enabled', 'Please check your email for further instructions.');
            } else {
                Alert.alert('2FA Disabled', 'Two-factor authentication has been disabled.');
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to update 2FA setting.');
        } finally {
            setSaving(false);
        }
    };

    const openEditModal = (type: string) => {
        setModalType(type);
        let value = '';
        if (type === 'nickname') value = user?.username || '';
        else if (type === 'fullname') value = user?.fullName || user?.name || '';
        else if (type === 'bio') value = user?.bio || '';
        else if (type === 'local') value = user?.congregation || '';
        else if (type === 'callSign') value = user?.callSign || '';
        else if (type === 'duty') value = user?.duty || '';
        else if (type === 'defaultLocation') value = user?.defaultLocation || '';
        setModalValue(value);
        setModalVisible(true);
    };

    const handleModalSave = async (value: string, confirmValue?: string) => {
        setSaving(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('No user');

            if (modalType === 'password') {
                if (!value || value !== confirmValue) {
                    Alert.alert('Error', 'Passwords do not match.');
                    return;
                }
                await updatePassword(currentUser, value);
                Alert.alert('Success', 'Password updated!');
            } else if (modalType === 'avatar') {
                setAvatarLoading(true);
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.7
                });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                    const uri = result.assets[0].uri;
                    await updateDoc(doc(firestore, 'users', currentUser.uid), { profileImage: uri });
                    setUser((prev: any) => ({ ...prev, profileImage: uri }));
                }
                setAvatarLoading(false);
            } else {
                const fieldMap: { [key: string]: string } = {
                    nickname: 'username',
                    fullname: 'fullName',
                    bio: 'bio',
                    local: 'congregation',
                    callSign: 'callSign',
                    duty: 'duty',
                    defaultLocation: 'defaultLocation'
                };
                const field = fieldMap[modalType || ''];
                if (field) {
                    await updateDoc(doc(firestore, 'users', currentUser.uid), { [field]: value });
                    setUser((prev: any) => ({ ...prev, [field]: value }));
                }
            }
            setModalVisible(false);
            Alert.alert('Success', 'Updated!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
            });
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Failed to sign out');
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
                {/* Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={24} color="#222" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <TouchableOpacity onPress={() => setShowProfileImage(true)}>
                        <Image
                            source={{
                                uri: user?.profileImage || user?.avatar || 'https://ui-avatars.com/api/?name=JD&background=7F5FFF&color=fff&size=64'
                            }}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => navigation.navigate('EditProfile' as never)}
                    >
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Edit Profile</Text>
                            <Text style={styles.settingDescription}>Update your personal information</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => {
                            setTwoFAAction(user?.twoFactorEnabled ? 'disable' : 'enable');
                            setShow2FAModal(true);
                        }}
                    >
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                            <Text style={styles.settingDescription}>
                                {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => navigation.navigate('NotificationFrequency' as never)}
                    >
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Email Frequency</Text>
                            <Text style={styles.settingDescription}>Manage your notification preferences</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => navigation.navigate('Help' as never)}
                    >
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Help & Support</Text>
                            <Text style={styles.settingDescription}>Get help and contact support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <EditModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSave={handleModalSave}
                    title={modalType ? `Edit ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}` : ''}
                    value={modalValue}
                    onChangeText={setModalValue}
                    isPassword={modalType === 'password'}
                    isAvatar={modalType === 'avatar'}
                    saving={saving}
                    avatarLoading={avatarLoading}
                />
                <TwoFAModal
                    visible={show2FAModal}
                    onClose={() => setShow2FAModal(false)}
                    onConfirm={handleConfirm2FA}
                    isEnable={twoFAAction === 'enable'}
                    saving={saving}
                />
                <SocialLinksModal
                    visible={activeModal === 'socialLinks'}
                    onClose={() => setActiveModal(null)}
                    onSave={async (socialLinks) => {
                        setSaving(true);
                        try {
                            const currentUser = auth.currentUser;
                            if (!currentUser) throw new Error('No user');
                            await updateDoc(doc(firestore, 'users', currentUser.uid), { socialLinks });
                            setUser((prev: any) => ({ ...prev, socialLinks }));
                            setActiveModal(null);
                            Alert.alert('Success', 'Social links updated!');
                        } catch (e) {
                            Alert.alert('Error', 'Failed to update social links.');
                        } finally {
                            setSaving(false);
                        }
                    }}
                    user={user}
                    saving={saving}
                />
                <AchievementsModal
                    visible={activeModal === 'achievements'}
                    onClose={() => setActiveModal(null)}
                    onSave={async (achievements) => {
                        setSaving(true);
                        try {
                            const currentUser = auth.currentUser;
                            if (!currentUser) throw new Error('No user');
                            await updateDoc(doc(firestore, 'users', currentUser.uid), { achievements });
                            setUser((prev: any) => ({ ...prev, achievements }));
                            setActiveModal(null);
                            Alert.alert('Success', 'Achievements updated!');
                        } catch (e) {
                            Alert.alert('Error', 'Failed to update achievements.');
                        } finally {
                            setSaving(false);
                        }
                    }}
                    user={user}
                    saving={saving}
                />
            </ScrollView>

            {/* Add ProfileImageModal */}
            <ProfileImageModal
                visible={showProfileImage}
                imageUrl={user?.profileImage || user?.avatar || 'https://ui-avatars.com/api/?name=JD&background=7F5FFF&color=fff&size=64'}
                onClose={() => setShowProfileImage(false)}
            />
        </SafeAreaView>
    );
}

function SettingsRow({ icon, label, subLabel, onPress }: any) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            <View style={styles.rowIcon}>{icon}</View>
            <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{label}</Text>
                {subLabel ? <Text style={styles.rowSubLabel}>{subLabel}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>
    );
}

function SettingsSwitchRow({ icon, label, subLabel, value, onValueChange, saving }: any) {
    return (
        <View style={styles.row}>
            <View style={styles.rowIcon}>{icon}</View>
            <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{label}</Text>
                {subLabel ? <Text style={styles.rowSubLabel}>{subLabel}</Text> : null}
            </View>
            <Switch value={value} onValueChange={onValueChange} disabled={saving} trackColor={{ true: '#7F5FFF', false: '#ccc' }} thumbColor={value ? '#7F5FFF' : '#f4f3f4'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E6E6FF',
    },
    sectionHeader: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#7F5FFF',
        marginTop: 24,
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    rowIcon: {
        width: 32,
        alignItems: 'center',
        marginRight: 12,
    },
    rowLabel: {
        fontSize: 15,
        color: '#222',
        fontWeight: '500',
    },
    rowSubLabel: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlayTouchable: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    modalCloseButton: {
        padding: 4,
    },
    modalBody: {
        padding: 16,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        gap: 12,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 12,
        color: '#222',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    modalButtonPrimary: {
        backgroundColor: '#7F5FFF',
    },
    modalButtonSecondary: {
        backgroundColor: '#f5f5f5',
    },
    modalButtonDisabled: {
        opacity: 0.7,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalButtonTextSecondary: {
        color: '#666',
        fontWeight: '500',
        fontSize: 16,
    },
    profileImageModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageModal: {
        width: '100%',
        height: '100%',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#7F5FFF',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
    },
    settingDescription: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    logoutButton: {
        padding: 16,
        backgroundColor: '#7F5FFF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
}); 