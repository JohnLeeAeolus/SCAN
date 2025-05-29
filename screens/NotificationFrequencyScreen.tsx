import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

type FrequencyOption = {
    id: string;
    label: string;
    description: string;
    value: 'immediate' | 'daily' | 'weekly' | 'never';
};

const frequencyOptions: FrequencyOption[] = [
    {
        id: 'immediate',
        label: 'Immediate',
        description: 'Receive notifications as soon as they arrive',
        value: 'immediate'
    },
    {
        id: 'daily',
        label: 'Daily Digest',
        description: 'Get a summary of all notifications once a day',
        value: 'daily'
    },
    {
        id: 'weekly',
        label: 'Weekly Summary',
        description: 'Receive a weekly summary of all notifications',
        value: 'weekly'
    },
    {
        id: 'never',
        label: 'Never',
        description: 'Don\'t send me any email notifications',
        value: 'never'
    }
];

export default function NotificationFrequencyScreen() {
    const navigation = useNavigation();
    const [selectedFrequency, setSelectedFrequency] = useState<string>('immediate');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUserPreferences();
    }, []);

    const fetchUserPreferences = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setSelectedFrequency(data.notificationFrequency || 'immediate');
            }
        } catch (error) {
            console.error('Error fetching user preferences:', error);
            Alert.alert('Error', 'Failed to load notification preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleFrequencyChange = async (frequency: string) => {
        if (frequency === selectedFrequency) return;

        setSaving(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('No user logged in');

            await updateDoc(doc(firestore, 'users', currentUser.uid), {
                notificationFrequency: frequency
            });

            setSelectedFrequency(frequency);
            Alert.alert('Success', 'Notification frequency updated successfully');
        } catch (error) {
            console.error('Error updating frequency:', error);
            Alert.alert('Error', 'Failed to update notification frequency');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    disabled={saving}
                >
                    <Ionicons name="arrow-back-outline" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.title}>Notification Frequency</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.description}>
                    Choose how often you want to receive email notifications about updates and activities.
                </Text>

                <View style={styles.optionsContainer}>
                    {frequencyOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.option,
                                selectedFrequency === option.value && styles.selectedOption
                            ]}
                            onPress={() => handleFrequencyChange(option.value)}
                            disabled={saving}
                        >
                            <View style={styles.optionContent}>
                                <Text style={[
                                    styles.optionLabel,
                                    selectedFrequency === option.value && styles.selectedOptionLabel
                                ]}>
                                    {option.label}
                                </Text>
                                <Text style={[
                                    styles.optionDescription,
                                    selectedFrequency === option.value && styles.selectedOptionDescription
                                ]}>
                                    {option.description}
                                </Text>
                            </View>
                            {selectedFrequency === option.value && (
                                <Ionicons name="checkmark-circle" size={24} color="#7F5FFF" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {saving && (
                    <View style={styles.savingOverlay}>
                        <Text style={styles.savingText}>Saving changes...</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingTop: 20,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        lineHeight: 22,
    },
    optionsContainer: {
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedOption: {
        borderColor: '#7F5FFF',
        backgroundColor: '#F8F5FF',
    },
    optionContent: {
        flex: 1,
        marginRight: 12,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginBottom: 4,
    },
    selectedOptionLabel: {
        color: '#7F5FFF',
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
    },
    selectedOptionDescription: {
        color: '#7F5FFF',
    },
    savingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    savingText: {
        fontSize: 16,
        color: '#7F5FFF',
        fontWeight: '600',
    },
}); 