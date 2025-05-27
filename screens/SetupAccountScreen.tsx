import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
    Linking,
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type SetupAccountScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SetupAccount'>;
};

const DUTIES = [
    'Usher',
    'Sound',
    'Security',
    'Cleaning',
    'Hospitality',
    'Other',
];

export default function SetupAccountScreen({ navigation }: SetupAccountScreenProps) {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [congregation, setCongregation] = useState('');
    const [duty, setDuty] = useState('');
    const [callSign, setCallSign] = useState('');
    const [username, setUsername] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const isFormValid =
        congregation.trim().length > 0 &&
        duty.trim().length > 0 &&
        callSign.trim().length > 0 &&
        acceptTerms;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleCreateAccount = async () => {
        if (!acceptTerms) {
            Alert.alert('Error', 'You must agree to the Terms of Service and Privacy Policy.');
            return;
        }
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user found');
            await updateDoc(doc(firestore, 'users', user.uid), {
                congregation,
                duty,
                callSign,
                username: username.trim() || null,
                profileImage: profileImage || null,
                setupComplete: true,
            });
            navigation.replace('MainTabs', { screen: 'Dashboard' });
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to complete setup.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.title}>Set up Account</Text>
                    <View style={styles.profileRow}>
                        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarPlaceholderText}>+</Text>
                                </View>
                            )}
                            <View style={styles.cameraIconWrapper}>
                                <Text style={styles.cameraIcon}>📷</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.profileHint}>Tap the camera icon to upload a profile picture.</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <Text style={styles.label}>Local Congregation</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your Local Congregation"
                        value={congregation}
                        onChangeText={setCongregation}
                    />
                    <Text style={styles.label}>Assigned Duties</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={duty}
                            onValueChange={setDuty}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select your Duties" value="" />
                            {DUTIES.map((d) => (
                                <Picker.Item key={d} label={d} value={d} />
                            ))}
                        </Picker>
                    </View>
                    <Text style={styles.label}>Call Sign</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your Call Sign"
                        value={callSign}
                        onChangeText={setCallSign}
                    />
                    <Text style={styles.label}>Username (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Choose a username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <View style={styles.termsRow}>
                        <TouchableOpacity onPress={() => setAcceptTerms((v) => !v)} style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                                {acceptTerms && <View style={styles.checkboxInner} />}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.termsText}>
                            I agree to the{' '}
                            <Text style={styles.link} onPress={() => Linking.openURL('https://yourapp.com/terms')}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={styles.link} onPress={() => Linking.openURL('https://yourapp.com/privacy')}>Privacy Policy</Text>
                            .
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.button, !isFormValid && styles.buttonDisabled]}
                        onPress={handleCreateAccount}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 18,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    avatarWrapper: {
        marginRight: 14,
        position: 'relative',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E6E6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarPlaceholderText: {
        fontSize: 32,
        color: '#7F5FFF',
        fontWeight: 'bold',
    },
    cameraIconWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cameraIcon: {
        fontSize: 16,
    },
    profileHint: {
        flex: 1,
        color: '#888',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
        marginLeft: 2,
        color: '#444',
    },
    input: {
        backgroundColor: '#F7F7F7',
        padding: 14,
        borderRadius: 8,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
    },
    pickerWrapper: {
        backgroundColor: '#F7F7F7',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 14,
    },
    picker: {
        height: 44,
        width: '100%',
    },
    termsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    checkboxContainer: {
        marginRight: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#B0B0B0',
        borderRadius: 4,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        borderColor: '#7F5FFF',
        backgroundColor: '#E6E6FF',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: '#7F5FFF',
        borderRadius: 2,
    },
    termsText: {
        fontSize: 13,
        color: '#444',
        flex: 1,
        flexWrap: 'wrap',
    },
    link: {
        color: '#7F5FFF',
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: '#7F5FFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    buttonDisabled: {
        backgroundColor: '#E6E6FF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 