import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image, ActivityIndicator, Alert, TextInput, Modal, Platform, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import * as ImagePicker from 'expo-image-picker';
import { updatePassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeModal, setActiveModal] = useState<null | 'nickname' | 'fullname' | 'password' | 'avatar' | 'bio' | 'local' | 'status' | 'socialLinks' | 'devices'>(null);
    const [editingDevices, setEditingDevices] = useState(false);
    const [devices, setDevices] = useState([
        { id: '1', name: 'iPhone 15 Pro', lastActive: 'Today, 10:12 AM' },
        { id: '2', name: 'iPad Air', lastActive: 'Yesterday, 8:45 PM' },
    ]);
    const [editValue, setEditValue] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editPasswordConfirm, setEditPasswordConfirm] = useState('');
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [twoFAAction, setTwoFAAction] = useState<'enable' | 'disable' | null>(null);

    useEffect(() => {
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
                Alert.alert('Error', 'Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };
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

    const handleEditDevices = () => setEditingDevices(true);
    const handleRemoveDevice = (id: string) => setDevices(devices.filter(d => d.id !== id));

    // Helper to open modal and set initial value
    const openEditModal = (field: string) => {
        setActiveModal(field as any);
        if (field === 'nickname') setEditValue(user?.username || '');
        else if (field === 'fullname') setEditValue(user?.fullName || user?.name || '');
        else if (field === 'bio') setEditValue(user?.bio || '');
        else if (field === 'local') setEditValue(user?.congregation || '');
        else if (field === 'password') { setEditPassword(''); setEditPasswordConfirm(''); }
    };

    // Save logic for each field
    const handleSaveEdit = async () => {
        setSaving(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('No user');
            if (activeModal === 'nickname') {
                await updateDoc(doc(firestore, 'users', currentUser.uid), { username: editValue.trim() });
                setUser((prev: any) => ({ ...prev, username: editValue.trim() }));
            } else if (activeModal === 'fullname') {
                await updateDoc(doc(firestore, 'users', currentUser.uid), { fullName: editValue.trim() });
                setUser((prev: any) => ({ ...prev, fullName: editValue.trim() }));
            } else if (activeModal === 'bio') {
                await updateDoc(doc(firestore, 'users', currentUser.uid), { bio: editValue });
                setUser((prev: any) => ({ ...prev, bio: editValue }));
            } else if (activeModal === 'local') {
                await updateDoc(doc(firestore, 'users', currentUser.uid), { congregation: editValue });
                setUser((prev: any) => ({ ...prev, congregation: editValue }));
            } else if (activeModal === 'password') {
                if (!editPassword || editPassword !== editPasswordConfirm) {
                    Alert.alert('Error', 'Passwords do not match.');
                    setSaving(false);
                    return;
                }
                await updatePassword(currentUser, editPassword);
                Alert.alert('Success', 'Password updated!');
            } else if (activeModal === 'avatar') {
                setAvatarLoading(true);
                const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                    const uri = result.assets[0].uri;
                    await updateDoc(doc(firestore, 'users', currentUser.uid), { profileImage: uri });
                    setUser((prev: any) => ({ ...prev, profileImage: uri }));
                }
                setAvatarLoading(false);
            }
            setActiveModal(null);
            setEditValue('');
            setEditPassword('');
            setEditPasswordConfirm('');
            Alert.alert('Success', 'Updated!');
        } catch (e) {
            Alert.alert('Error', 'Failed to update.');
        } finally {
            setSaving(false);
        }
    };

    // Helper for rendering editable row
    function EditableRow({ label, value, editing, onEdit, onSave, onCancel, onChangeText, loading, secureTextEntry = false }: any) {
        return editing ? (
            <View style={styles.row}>
                <View style={styles.rowIcon}><Ionicons name="pencil-outline" size={20} color="#888" /></View>
                <TextInput
                    style={[styles.rowLabel, { flex: 1, borderBottomWidth: 1, borderColor: '#7F5FFF', marginRight: 8 }]}
                    value={value}
                    onChangeText={onChangeText}
                    editable={!loading}
                    secureTextEntry={secureTextEntry}
                    autoFocus
                />
                <TouchableOpacity onPress={onSave} disabled={loading} style={{ marginRight: 8 }}>
                    <Ionicons name="checkmark" size={22} color="#7F5FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onCancel} disabled={loading}>
                    <Ionicons name="close" size={22} color="#888" />
                </TouchableOpacity>
            </View>
        ) : (
            <SettingsRow icon={<Ionicons name="pencil-outline" size={20} color="#888" />} label={label} subLabel={value} onPress={onEdit} />
        );
    }

    // Avatar row
    function AvatarRow() {
        return (
            <TouchableOpacity style={styles.row} onPress={() => setActiveModal('avatar')} disabled={saving}>
                <View style={styles.rowIcon}><MaterialCommunityIcons name="pencil-outline" size={20} color="#888" /></View>
                <Image source={{ uri: user?.profileImage || user?.avatar || 'https://ui-avatars.com/api/?name=JD&background=7F5FFF&color=fff&size=64' }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }} />
                <Text style={styles.rowLabel}>Change Avatar/Photo</Text>
                <Ionicons name="chevron-forward" size={20} color="#bbb" />
            </TouchableOpacity>
        );
    }

    // Social Links Modal
    function SocialLinksModal() {
        const [socialLinksDraft, setSocialLinksDraft] = useState(user?.socialLinks || []);
        const [newSocialLink, setNewSocialLink] = useState('');
        useEffect(() => {
            if (activeModal === 'socialLinks') {
                setSocialLinksDraft(user?.socialLinks || []);
                setNewSocialLink('');
            }
        }, [activeModal]);
        const handleAddSocialLink = () => {
            if (newSocialLink.trim() && !socialLinksDraft.includes(newSocialLink.trim())) {
                setSocialLinksDraft([...socialLinksDraft, newSocialLink.trim()]);
                setNewSocialLink('');
            }
        };
        const handleRemoveSocialLink = (link: string) => {
            setSocialLinksDraft(socialLinksDraft.filter((l: string) => l !== link));
        };
        const handleSaveSocialLinks = async () => {
            setSaving(true);
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) throw new Error('No user');
                await updateDoc(doc(firestore, 'users', currentUser.uid), { socialLinks: socialLinksDraft });
                setUser((prev: any) => ({ ...prev, socialLinks: socialLinksDraft }));
                setActiveModal(null);
                Alert.alert('Success', 'Social links updated!');
            } catch (e) {
                Alert.alert('Error', 'Failed to update social links.');
            } finally {
                setSaving(false);
            }
        };
        if (activeModal !== 'socialLinks') return null;
        // Pop-up animation
        const [visible, setVisible] = useState(true);
        const scale = React.useRef(new Animated.Value(0.8)).current;
        const opacity = React.useRef(new Animated.Value(0)).current;
        useEffect(() => {
            Animated.parallel([
                Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
            ]).start();
            return () => {
                scale.setValue(0.8);
                opacity.setValue(0);
            };
        }, []);
        return (
            <Modal transparent visible={visible} animationType="none">
                <View style={styles.modalOverlay}>
                    <Animated.View style={[styles.popupModal, { transform: [{ scale }], opacity }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Edit Social Links</Text>
                        {socialLinksDraft.map((link: string, idx: number) => (
                            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                <Text style={{ flex: 1, color: '#222' }}>{link}</Text>
                                <TouchableOpacity onPress={() => handleRemoveSocialLink(link)}>
                                    <Ionicons name="close-circle-outline" size={20} color="#E57373" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginRight: 8 }]}
                                placeholder="Add new link"
                                value={newSocialLink}
                                onChangeText={setNewSocialLink}
                            />
                            <TouchableOpacity onPress={handleAddSocialLink} disabled={!newSocialLink.trim()}>
                                <Ionicons name="add-circle-outline" size={28} color={newSocialLink.trim() ? '#7F5FFF' : '#ccc'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                            <TouchableOpacity onPress={() => { setVisible(false); setActiveModal(null); }} style={{ marginRight: 16 }}>
                                <Text style={{ color: '#888', fontSize: 16 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveSocialLinks} disabled={saving}>
                                <Text style={{ color: '#7F5FFF', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        );
    }

    // Animated modal helper
    function AnimatedModal({ visible, children }: { visible: boolean; children: React.ReactNode }) {
        const [show, setShow] = useState(visible);
        const opacity = React.useRef(new Animated.Value(0)).current;
        useEffect(() => {
            if (visible) {
                setShow(true);
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true, easing: Easing.out(Easing.ease) }).start();
            } else {
                Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true, easing: Easing.in(Easing.ease) }).start(() => setShow(false));
            }
        }, [visible]);
        if (!show) return null;
        return (
            <Modal transparent visible={show} animationType={Platform.OS === 'ios' ? 'fade' : undefined}>
                <Animated.View style={[styles.modalOverlay, { opacity }]}>{children}</Animated.View>
            </Modal>
        );
    }

    // Device Modal
    function DevicesModal() {
        return (
            <AnimatedModal visible={editingDevices}>
                <View style={[styles.modalContent, { borderTopColor: '#7F5FFF', borderTopWidth: 4 }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12, color: '#7F5FFF' }}>Linked Devices</Text>
                    {devices.length === 0 ? (
                        <Text style={{ color: '#888', marginBottom: 12 }}>No devices linked.</Text>
                    ) : (
                        devices.map(device => (
                            <View key={device.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="phone-portrait-outline" size={20} color="#7F5FFF" style={{ marginRight: 8 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#222', fontWeight: '500' }}>{device.name}</Text>
                                    <Text style={{ color: '#888', fontSize: 12 }}>Last active: {device.lastActive}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveDevice(device.id)}>
                                    <Ionicons name="trash-outline" size={20} color="#E57373" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                        <TouchableOpacity onPress={() => setEditingDevices(false)}>
                            <Text style={{ color: '#7F5FFF', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </AnimatedModal>
        );
    }

    // Dynamic Modal
    function EditModal() {
        if (!activeModal || activeModal === 'socialLinks' || activeModal === 'devices') return null;
        let label = '';
        if (activeModal === 'nickname') label = 'Edit Nickname';
        else if (activeModal === 'fullname') label = 'Edit Full Name';
        else if (activeModal === 'bio') label = 'Edit Bio';
        else if (activeModal === 'local') label = 'Edit Local';
        else if (activeModal === 'password') label = 'Change Password';
        else if (activeModal === 'avatar') label = 'Change Profile Photo';

        // Animation
        const [visible, setVisible] = useState(true);
        const scale = React.useRef(new Animated.Value(0.8)).current;
        const opacity = React.useRef(new Animated.Value(0)).current;
        useEffect(() => {
            Animated.parallel([
                Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
            ]).start();
            return () => {
                scale.setValue(0.8);
                opacity.setValue(0);
            };
        }, []);

        return (
            <Modal transparent visible={visible} animationType="none">
                <View style={styles.modalOverlay}>
                    <Animated.View style={[styles.popupModal, { transform: [{ scale }], opacity }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{label}</Text>
                        {activeModal === 'password' ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="New Password"
                                    value={editPassword}
                                    onChangeText={setEditPassword}
                                    secureTextEntry
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm New Password"
                                    value={editPasswordConfirm}
                                    onChangeText={setEditPasswordConfirm}
                                    secureTextEntry
                                />
                            </>
                        ) : activeModal === 'avatar' ? (
                            <TouchableOpacity style={[styles.button, { marginBottom: 16 }]} onPress={handleSaveEdit} disabled={avatarLoading}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{avatarLoading ? 'Uploading...' : 'Pick New Photo'}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TextInput
                                style={styles.input}
                                value={editValue}
                                onChangeText={setEditValue}
                                editable={!saving}
                                autoFocus
                            />
                        )}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                            <TouchableOpacity onPress={() => { setVisible(false); setActiveModal(null); }} style={{ marginRight: 16 }}>
                                <Text style={{ color: '#888', fontSize: 16 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveEdit} disabled={saving || (activeModal === 'avatar' && avatarLoading)}>
                                <Text style={{ color: '#7F5FFF', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        );
    }

    function TwoFAModal() {
        if (!show2FAModal) return null;
        const isEnable = twoFAAction === 'enable';
        return (
            <Modal transparent visible animationType="fade">
                <View style={styles.modalOverlay}>
                    <Animated.View style={[styles.popupModal, { opacity: 1, transform: [{ scale: 1 }] }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{isEnable ? 'Enable Two-Factor Authentication' : 'Disable Two-Factor Authentication'}</Text>
                        <Text style={{ color: '#444', marginBottom: 18 }}>
                            {isEnable
                                ? 'Two-factor authentication adds an extra layer of security. You will receive further instructions via email.'
                                : 'Are you sure you want to disable two-factor authentication?'}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                            <TouchableOpacity onPress={() => { setShow2FAModal(false); setTwoFAAction(null); }} style={{ marginRight: 16 }}>
                                <Text style={{ color: '#888', fontSize: 16 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirm2FA} disabled={saving}>
                                <Text style={{ color: '#7F5FFF', fontWeight: 'bold', fontSize: 16 }}>{isEnable ? 'Enable' : 'Disable'}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        );
    }

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}><ActivityIndicator size="large" color="#7F5FFF" /></View>;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={24} color="#222" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <TouchableOpacity>
                        <Image
                            source={{ uri: user?.profileImage || user?.avatar || 'https://ui-avatars.com/api/?name=JD&background=7F5FFF&color=fff&size=64' }}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                </View>

                {/* Account Section */}
                <Text style={styles.sectionHeader}>Account</Text>
                <SettingsRow icon={<Ionicons name="person-outline" size={20} color="#888" />} label="Nickname" subLabel={user?.username || 'N/A'} onPress={() => openEditModal('nickname')} />
                <SettingsRow icon={<Ionicons name="person-outline" size={20} color="#888" />} label="Full Name" subLabel={user?.fullName || user?.name || 'N/A'} onPress={() => openEditModal('fullname')} />
                <AvatarRow />
                <SettingsRow icon={<MaterialCommunityIcons name="shield-account-outline" size={20} color="#888" />} label="Manage Access" subLabel="Permissions and roles" onPress={() => navigation.navigate('ManageAccess' as never)} />

                {/* Password Modal */}
                <SettingsRow icon={<Ionicons name="lock-closed-outline" size={20} color="#888" />} label="Change Password" subLabel="Update your login credentials" onPress={() => openEditModal('password')} />
                <SettingsSwitchRow icon={<Ionicons name="notifications-outline" size={20} color="#888" />} label="Push Notifications" subLabel="Receive alerts on your device" value={pushNotifications} onValueChange={(v: boolean) => handleToggle('pushNotifications', v)} saving={saving} />
                <SettingsSwitchRow icon={<Ionicons name="mail-outline" size={20} color="#888" />} label="Email Notifications" subLabel="Receive alerts via email" value={emailNotifications} onPress={() => handleToggle('emailNotifications', !emailNotifications)} saving={saving} />
                <SettingsRow icon={<Ionicons name="time-outline" size={20} color="#888" />} label="Notification Frequency" subLabel="Choose how often you receive emails" onPress={() => navigation.navigate('NotificationFrequency' as never)} />

                {/* Security Section */}
                <Text style={styles.sectionHeader}>Security</Text>
                <SettingsRow icon={<MaterialCommunityIcons name="shield-lock-outline" size={20} color="#888" />} label="Two-Factor Authentication" subLabel="Add an extra layer of security" value={twoFactor} onValueChange={handleToggleTwoFactor} saving={saving} />
                <SettingsRow icon={<Ionicons name="share-social-outline" size={20} color="#888" />} label="Social Links" subLabel={user?.socialLinks?.length ? user.socialLinks.join(', ') : 'N/A'} onPress={() => setActiveModal('socialLinks')} />
                <SocialLinksModal />

                {/* Editable Fields */}
                <Text style={styles.sectionHeader}>Personal Information</Text>
                <SettingsRow icon={<Ionicons name="person-outline" size={20} color="#888" />} label="Bio" subLabel={user?.bio || 'N/A'} onPress={() => openEditModal('bio')} />
                <SettingsRow icon={<Ionicons name="home-outline" size={20} color="#888" />} label="Local" subLabel={user?.congregation || 'N/A'} onPress={() => openEditModal('local')} />
                <EditModal />
                <TwoFAModal />
            </ScrollView>
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
        paddingHorizontal: 0,
        paddingTop: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 12,
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
        marginTop: 28,
        marginBottom: 8,
        paddingHorizontal: 18,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 18,
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxWidth: 400,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#7F5FFF',
    },
    popupModal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxWidth: 400,
    },
}); 