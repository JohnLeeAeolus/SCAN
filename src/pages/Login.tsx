import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Divider, Snackbar, Alert } from '@mui/material';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'error' }>({ open: false, message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder: Accept any non-empty email/password
        if (form.email && form.password) {
            setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
            setTimeout(() => onLogin(), 1000);
        } else {
            setSnackbar({ open: true, message: 'Please enter email and password.', severity: 'error' });
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafbfc' }}>
            <Card sx={{ minWidth: 350, maxWidth: 400, mx: 'auto', borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                <CardContent>
                    <Typography variant="h5" fontWeight={700} gutterBottom color="#7c3aed" align="center">
                        Admin Login
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: '#7c3aed', color: '#fff', borderRadius: 2, fontWeight: 600 }}>
                            Login
                        </Button>
                    </Box>
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

export default Login; 