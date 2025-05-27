import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    SignUp: undefined;
    SignIn: undefined;
    Home: undefined;
    Schedule: undefined;
    Report: undefined;
    SetupAccount: undefined;
    MainTabs: { screen?: string } | undefined;
    ProfileScreen: undefined;
    Settings: undefined;
    ChangeUsername: undefined;
    ChangeAvatar: undefined;
    ManageAccess: undefined;
    NotificationFrequency: undefined;
    ChangePassword: undefined;
    LinkedDevices: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>; 