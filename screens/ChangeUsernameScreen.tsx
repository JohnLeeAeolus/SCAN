import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ChangeUsernameScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back-outline" size={24} color="#222" />
            </TouchableOpacity>
            <Text style={styles.title}>Change Username</Text>
            <Text style={styles.desc}>This is a placeholder screen for changing your username.</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 24 },
    backBtn: { marginBottom: 18 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    desc: { color: '#888' },
}); 