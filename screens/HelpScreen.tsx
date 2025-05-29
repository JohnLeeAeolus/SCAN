import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type HelpScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Help'>;
};

const HelpScreen: React.FC<HelpScreenProps> = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@scanconnect.com');
    };

    const handleOpenFAQ = () => {
        Linking.openURL('https://scanconnect.com/faq');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    <TouchableOpacity style={styles.card} onPress={handleOpenFAQ}>
                        <View style={styles.cardContent}>
                            <Ionicons name="help-circle-outline" size={24} color="#7F5FFF" />
                            <View style={styles.cardText}>
                                <Text style={styles.cardTitle}>View FAQs</Text>
                                <Text style={styles.cardDescription}>Find answers to common questions</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#666" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Support</Text>
                    <TouchableOpacity style={styles.card} onPress={handleContactSupport}>
                        <View style={styles.cardContent}>
                            <Ionicons name="mail-outline" size={24} color="#7F5FFF" />
                            <View style={styles.cardText}>
                                <Text style={styles.cardTitle}>Email Support</Text>
                                <Text style={styles.cardDescription}>Get help from our support team</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#666" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Information</Text>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>Version</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>Last Updated</Text>
                        <Text style={styles.infoValue}>March 2024</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7F5FFF',
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardText: {
        flex: 1,
        marginLeft: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
    },
    infoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    infoTitle: {
        fontSize: 16,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
});

export default HelpScreen; 