import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Linking,
    ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

// Checkbox component
function Checkbox({ checked, onPress }: { checked: boolean; onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <View style={styles.checkboxInner} />}
            </View>
        </TouchableOpacity>
    );
}

type SignUpScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const isFormValid =
        fullName.trim().length > 0 &&
        email.trim().length > 0 &&
        password.length >= 6 &&
        password === confirmPassword &&
        acceptTerms;

    const handleSignUp = async () => {
        if (!acceptTerms) {
            Alert.alert('Error', 'You must accept the Terms of Use and Privacy Policy.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }
        setLoading(true);
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Store additional user data in Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
                fullName,
                email: user.email,
                createdAt: new Date().toISOString(),
                role: 'user',
                lastLogin: new Date().toISOString(),
                setupComplete: false,
            });
            navigation.replace('SetupAccount');
        } catch (error: any) {
            let errorMessage = 'An error occurred during sign up';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.welcome}>Welcome</Text>
                    <Text style={styles.subtitle}>Create you account here!</Text>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarInitials}>{initials || 'CC'}</Text>
                        </View>
                    </View>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                    />
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <View style={styles.termsRow}>
                        <Checkbox checked={acceptTerms} onPress={() => setAcceptTerms((v) => !v)} />
                        <Text style={styles.termsText}>
                            I accept the app's{' '}
                            <Text style={styles.link} onPress={() => Linking.openURL('https://yourapp.com/terms')}>Terms of Use</Text>
                            {' '}and{' '}
                            <Text style={styles.link} onPress={() => Linking.openURL('https://yourapp.com/privacy')}>Privacy Policy</Text>
                            .
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.button, !isFormValid && styles.buttonDisabled]}
                        onPress={handleSignUp}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Setup Account</Text>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.loginText}>
                        Already have an account?{' '}
                        <Text style={styles.loginLink} onPress={() => navigation.navigate('SignIn')}>
                            Log in
                        </Text>
                    </Text>
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
        justifyContent: 'center',
    },
    welcome: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 24,
        marginTop: 4,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#7F5FFF', // fallback for RN
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarInitials: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
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
    loginText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 15,
        color: '#888',
    },
    loginLink: {
        color: '#7F5FFF',
        fontWeight: 'bold',
    },
}); 