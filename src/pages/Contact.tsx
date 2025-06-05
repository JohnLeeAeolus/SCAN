import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Divider, TextField, Button, Grid, Snackbar, Alert } from '@mui/material';

const Contact: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'error' }>({ open: false, message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSnackbar({ open: true, message: 'Message sent! (placeholder)', severity: 'success' });
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, mb: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom color="#7c3aed">
                Contact Us
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Send us a message
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
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
                                    label="Message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <Button type="submit" variant="contained" sx={{ bgcolor: '#7c3aed', color: '#fff', borderRadius: 2, fontWeight: 600 }}>
                                    Send Message
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Contact Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" fontWeight={600} mb={1}>Address</Typography>
                            <Typography mb={2}>123 Tech Street, Silicon Valley, CA 94043, United States</Typography>
                            <Typography variant="body1" fontWeight={600} mb={1}>Phone</Typography>
                            <Typography mb={2}>+1 (123) 456-7890</Typography>
                            <Typography variant="body1" fontWeight={600} mb={1}>Email</Typography>
                            <Typography mb={2}>info@example.com</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity || 'info'} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Contact; 