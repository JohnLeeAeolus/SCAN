import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

interface UserData {
    username?: string;
    fullName?: string;
    bio?: string;
    congregation?: string;
    callSign?: string;
    duty?: string;
    defaultLocation?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    avatar?: string;
    socialLinks?: Array<{ platform: string, label: string, color: string }>;
    achievements?: Array<{ icon: string, title: string, desc: string }>;
}

export default function EditProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        bio: '',
        congregation: '',
        callSign: '',
        duty: '',
        defaultLocation: '',
        email: '',
        phone: '',
        socialLinks: [] as Array<{ platform: string, label: string, color: string }>,
        achievements: [] as Array<{ icon: string, title: string, desc: string }>
    });
    const [avatarLoading, setAvatarLoading] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                Alert.alert('Error', 'No user found');
                navigation.goBack();
                return;
            }

            const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUser(data);
                setFormData({
                    username: data.username || '',
                    fullName: data.fullName || '',
                    bio: data.bio || '',
                    congregation: data.congregation || '',
                    callSign: data.callSign || '',
                    duty: data.duty || '',
                    defaultLocation: data.defaultLocation || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    socialLinks: data.socialLinks || [],
                    achievements: data.achievements || []
                });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            Alert.alert('Error', 'Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('No user found');

            const updateData = {
                username: formData.username,
                fullName: formData.fullName,
                bio: formData.bio,
                congregation: formData.congregation,
                callSign: formData.callSign,
                duty: formData.duty,
                defaultLocation: formData.defaultLocation,
                email: formData.email,
                phone: formData.phone,
                socialLinks: formData.socialLinks,
                achievements: formData.achievements,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(doc(firestore, 'users', currentUser.uid), updateData);
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleImagePick = async () => {
        try {
            setAvatarLoading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                const currentUser = auth.currentUser;
                if (!currentUser) throw new Error('No user found');

                await updateDoc(doc(firestore, 'users', currentUser.uid), {
                    profileImage: uri,
                    updatedAt: new Date().toISOString()
                });

                setUser((prev: UserData | null) => prev ? { ...prev, profileImage: uri } : null);
                Alert.alert('Success', 'Profile image updated');
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
            Alert.alert('Error', 'Failed to update profile image');
        } finally {
            setAvatarLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7F5FFF" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.scrollView}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#222" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit Profile</Text>
                        <TouchableOpacity
                            onPress={handleUpdateProfile}
                            disabled={saving}
                            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        >
                            <Text style={styles.saveButtonText}>
                                {saving ? 'Saving...' : 'Save'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Profile Image */}
                    <View style={styles.profileImageContainer}>
                        <TouchableOpacity onPress={handleImagePick} disabled={avatarLoading}>
                            <Image
                                source={{
                                    uri: user?.profileImage || user?.avatar || 'https://ui-avatars.com/api/?name=JD&background=7F5FFF&color=fff&size=64'
                                }}
                                style={styles.profileImage}
                            />
                            <View style={styles.editImageOverlay}>
                                <Ionicons name="camera" size={24} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        {avatarLoading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator color="#fff" />
                            </View>
                        )}
                    </View>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.username}
                                onChangeText={(value) => handleChange('username', value)}
                                placeholder="Enter username"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.fullName}
                                onChangeText={(value) => handleChange('fullName', value)}
                                placeholder="Enter full name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.bio}
                                onChangeText={(value) => handleChange('bio', value)}
                                placeholder="Tell us about yourself"
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Congregation</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.congregation}
                                onChangeText={(value) => handleChange('congregation', value)}
                                placeholder="Enter congregation"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Call Sign</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.callSign}
                                onChangeText={(value) => handleChange('callSign', value)}
                                placeholder="Enter call sign"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Duty</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.duty}
                                onChangeText={(value) => handleChange('duty', value)}
                                placeholder="Enter duty"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Default Location</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.defaultLocation}
                                onChangeText={(value) => handleChange('defaultLocation', value)}
                                placeholder="Enter default location"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(value) => handleChange('email', value)}
                                placeholder="Enter email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(value) => handleChange('phone', value)}
                                placeholder="Enter phone number"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    saveButton: {
        backgroundColor: '#7F5FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    profileImageContainer: {
        alignItems: 'center',
        padding: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editImageOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#7F5FFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
    },
    form: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#222',
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
}); 