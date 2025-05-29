import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from './firebase/config';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import ReportScreen from './screens/ReportScreen';
import SetupAccountScreen from './screens/SetupAccountScreen';
import LoadingScreen from './components/LoadingScreen';
import { RootStackParamList } from './types/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChangeUsernameScreen from './screens/ChangeUsernameScreen';
import ChangeAvatarScreen from './screens/ChangeAvatarScreen';
import ManageAccessScreen from './screens/ManageAccessScreen';
import NotificationFrequencyScreen from './screens/NotificationFrequencyScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import HelpScreen from './screens/HelpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs({ route }: { route?: { params?: { screen?: string } } }) {
    return (
        <Tab.Navigator
            initialRouteName={route?.params?.screen || 'Dashboard'}
            screenOptions={({ route }: { route: RouteProp<Record<string, object | undefined>, string> }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#7F5FFF',
                tabBarInactiveTintColor: '#888',
                tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 8 },
                tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
                tabBarIcon: ({ color, size }: { color: string; size: number }) => {
                    if (route.name === 'Dashboard') {
                        return <Ionicons name="home" size={size} color={color} />;
                    } else if (route.name === 'DutySchedule') {
                        return <MaterialCommunityIcons name="calendar-check-outline" size={size} color={color} />;
                    } else if (route.name === 'Events') {
                        return <Ionicons name="calendar-outline" size={size} color={color} />;
                    } else if (route.name === 'Profile') {
                        return <Ionicons name="person-outline" size={size} color={color} />;
                    } else if (route.name === 'Settings') {
                        return <Ionicons name="settings-outline" size={size} color={color} />;
                    }
                    return null;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={HomeScreen} />
            <Tab.Screen name="DutySchedule" component={ScheduleScreen} options={{ title: 'Duty Schedule' }} />
            <Tab.Screen name="Events" component={ReportScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Tab.Navigator>
    );
}

export default function App() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [setupComplete, setSetupComplete] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Check if setup is complete
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                const isSetup = userDoc.exists() ? userDoc.data().setupComplete === true : false;
                setSetupComplete(isSetup);
                console.log('Auth user:', user.email, '| setupComplete:', isSetup);
            } else {
                setSetupComplete(null);
                console.log('No user signed in');
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading || (user && setupComplete === null)) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <>
                        <Stack.Screen name="SignIn" component={SignInScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                        <Stack.Screen name="ForgotPassword" component={SignInScreen} />
                    </>
                ) : setupComplete === false ? (
                    <Stack.Screen name="SetupAccount" component={SetupAccountScreen} />
                ) : (
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                        <Stack.Screen name="ChangeUsername" component={ChangeUsernameScreen} />
                        <Stack.Screen name="ChangeAvatar" component={ChangeAvatarScreen} />
                        <Stack.Screen name="ManageAccess" component={ManageAccessScreen} />
                        <Stack.Screen name="NotificationFrequency" component={NotificationFrequencyScreen} />
                        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                        <Stack.Screen name="Help" component={HelpScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
} 