import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Divider,
    Switch,
    FormControlLabel,
    Checkbox,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';

const Settings: React.FC = () => {
    const [name, setName] = useState('Admin User');
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('');
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
    });
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'error' }>({ open: false, message: '' });

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSnackbar({ open: true, message: 'Profile updated!', severity: 'success' });
    };

    const handleNotificationsChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications({ ...notifications, [key]: e.target.checked });
    };

    const handleDeleteAccount = () => {
        setSnackbar({ open: true, message: 'Account deletion not implemented.', severity: 'info' });
    };

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, mb: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom color="#7c3aed">
                Settings
            </Typography>
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Profile Settings
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box component="form" onSubmit={handleProfileSave}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    placeholder="••••••••"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" sx={{ bgcolor: '#7c3aed', color: '#fff', borderRadius: 2, fontWeight: 600 }}>
                                    Save Changes
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Notification Preferences
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <FormControlLabel
                        control={<Checkbox checked={notifications.email} onChange={handleNotificationsChange('email')} />}
                        label="Email Notifications"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={notifications.sms} onChange={handleNotificationsChange('sms')} />}
                        label="SMS Notifications"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={notifications.push} onChange={handleNotificationsChange('push')} />}
                        label="Push Notifications"
                    />
                </CardContent>
            </Card>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Account Actions
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Button variant="outlined" color="error" onClick={handleDeleteAccount} sx={{ fontWeight: 600 }}>
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity || 'info'} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings; 