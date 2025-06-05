import React from 'react';
import { Box, Typography, Divider, TextField, Button } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#fff',
                color: '#7c3aed',
                pt: 6,
                pb: 4,
                textAlign: 'center',
                borderTop: '1px solid #eee',
            }}
        >
            <Divider sx={{ mb: 4 }} />
            <QrCodeIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#7c3aed', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom display="inline">
                Admin Hub
            </Typography>
            <Typography variant="body2" color="#888" mb={2}>
                Subscribe to our updates
            </Typography>
            <Box component="form" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TextField size="small" placeholder="your.email@example.com" sx={{ bgcolor: '#f3f6fa', borderRadius: 2 }} />
                <Button variant="contained" sx={{ bgcolor: '#7c3aed', color: '#fff' }}>Subscribe</Button>
            </Box>
            <Typography variant="caption" color="#888">
                © {new Date().getFullYear()} Admin Hub.
            </Typography>
        </Box>
    );
};

export default Footer; 