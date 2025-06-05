import React from 'react';
import { Box, Typography, Card, CardContent, Divider, Grid, Avatar } from '@mui/material';

const teamMembers = [
    { name: 'John Doe', role: 'CEO', image: 'https://source.unsplash.com/random/400x400?portrait=1' },
    { name: 'Jane Smith', role: 'CTO', image: 'https://source.unsplash.com/random/400x400?portrait=2' },
    { name: 'Mike Johnson', role: 'Lead Developer', image: 'https://source.unsplash.com/random/400x400?portrait=3' },
];

const About: React.FC = () => {
    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, mb: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom color="#7c3aed">
                About Us
            </Typography>
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Our Company
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography>
                        We are dedicated to providing the best service to our customers. Our mission is to make technology accessible to everyone.
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Our Mission
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography>
                        To empower businesses and individuals with innovative QR code solutions and seamless digital experiences.
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Our Team
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                        {teamMembers.map((member, idx) => (
                            <Grid item xs={12} sm={4} key={idx}>
                                <Card sx={{ textAlign: 'center', borderRadius: 2, boxShadow: '0 1px 6px 0 rgba(140, 140, 255, 0.06)' }}>
                                    <CardContent>
                                        <Avatar src={member.image} alt={member.name} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                                        <Typography variant="h6" fontWeight={600}>{member.name}</Typography>
                                        <Typography color="text.secondary">{member.role}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default About; 