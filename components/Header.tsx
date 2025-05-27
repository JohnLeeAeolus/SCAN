import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/config';

export const Header = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('Login' as never);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <View style={styles.header}>
            <Text style={styles.title}>ScanConnect</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    logoutButton: {
        padding: 8,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
    },
}); 