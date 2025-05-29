import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    Home: undefined;
    Profile: undefined;
    Settings: undefined;
    EditProfile: undefined;
    NotificationFrequency: undefined;
    Help: undefined;
    ChangePassword: undefined;
    LinkedDevices: undefined;
    SetupAccount: undefined;
    MainTabs: { screen?: string } | undefined;
    ProfileScreen: undefined;
    ChangeUsername: undefined;
    ChangeAvatar: undefined;
    ManageAccess: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>; 