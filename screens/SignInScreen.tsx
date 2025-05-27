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
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type SignInScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
};

export default function SignInScreen({ navigation }: SignInScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const initials = email
        ? email.split('@')[0].slice(0, 2).toUpperCase()
        : 'CC';

    const isFormValid = email.trim().length > 0 && password.length >= 6;

    const handleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            let errorMessage = 'An error occurred during sign in';
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password';
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder handlers for social logins
    const handleSocialLogin = (provider: string) => {
        Alert.alert('Info', `Social login with ${provider} is not implemented yet.`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
            </View>
            <Text style={styles.title}>Log In</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="m@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={!isFormValid || loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Reset Password', 'Password reset flow not implemented yet.')}
                style={styles.forgotPasswordBtn}
            >
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
            <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.divider} />
            </View>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Email')}>
                <Text style={styles.socialButtonText}>✉️  Continue with Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Apple')}>
                <Text style={styles.socialButtonText}>  Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Youtube')}>
                <Text style={styles.socialButtonText}>▶️  Continue with Youtube</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Facebook')}>
                <Text style={styles.socialButtonText}>📘  Continue with Facebook</Text>
            </TouchableOpacity>
            <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
                    Sign up
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'center',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#7F5FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarInitials: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 18,
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
    forgotPasswordBtn: {
        alignItems: 'center',
        marginBottom: 12,
    },
    forgotPasswordText: {
        color: '#888',
        fontSize: 14,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    orText: {
        marginHorizontal: 8,
        color: '#888',
        fontSize: 14,
    },
    socialButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginBottom: 10,
    },
    socialButtonText: {
        fontSize: 16,
        color: '#444',
    },
    signupText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 15,
        color: '#888',
    },
    signupLink: {
        color: '#7F5FFF',
        fontWeight: 'bold',
    },
}); 