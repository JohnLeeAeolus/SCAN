import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Grid,
    Card,
    Chip,
    Divider,
    Paper,
    TextField,
    InputBase,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

const drawerWidth = 240;

const sidebarItems = [
    { text: 'Dashboard', icon: <DashboardIcon color="primary" />, path: '/' },
    { text: 'User Management', icon: <GroupIcon />, path: '/users' },
    { text: 'QR Code Tools', icon: <QrCodeIcon />, path: '/qr-tools' },
    { text: 'Analytics & Reports', icon: <AssessmentIcon />, path: '/analytics' },
    { text: 'Overview', icon: <AssessmentIcon />, path: '/overview' },
    { text: 'Scan Reports', icon: <AssessmentIcon />, path: '/scan-reports' },
    { text: 'User Demographics', icon: <GroupIcon />, path: '/demographics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const stats = [
    { label: 'Total Users', value: '1,245', change: '+20% from last month', path: '/analytics?tab=users' },
    { label: 'Scans Today', value: '876', change: '+12% from yesterday', path: '/analytics?tab=scans' },
    { label: 'Active QR Codes', value: '210', change: '2 new this week', path: '/qr-tools' },
    { label: 'Total Revenue', value: '$12,500', change: '+5% target', path: '/analytics?tab=revenue' },
];

const quickActions = [
    { text: 'Generate QR Code', color: 'secondary' as const, action: 'generateQR' },
    { text: 'Add New User', color: 'secondary' as const, action: 'addUser' },
    { text: 'View Reports', color: 'secondary' as const, action: 'viewReports' },
    { text: 'Go to Settings', color: 'secondary' as const, action: 'settings' },
];

const qrTools = [
    { text: 'Generate New QR Code', desc: 'Create custom QR codes for various purposes.', action: 'generateQR' },
    { text: 'View Scan History', desc: 'Track all QR code scans and analytics.', action: 'scanHistory' },
    { text: 'Manage Campaigns', desc: 'Organize and monitor your QR code campaigns.', action: 'manageCampaigns' },
];

const recentUsers = [
    { name: 'Alice Johnson', email: 'alice.j@example.com', status: 'Active', time: '2 hours ago', avatar: 'A' },
    { name: 'Bob Williams', email: 'bob.w@example.com', status: 'Inactive', time: '1 day ago', avatar: 'B' },
    { name: 'Charlie Brown', email: 'charlie.b@example.com', status: 'Active', time: '30 mins ago', avatar: 'C' },
    { name: 'Diana Smith', email: 'diana.s@example.com', status: 'Pending', time: '5 hours ago', avatar: 'D' },
    { name: 'Eve Davis', email: 'eve.d@example.com', status: 'Active', time: '2 days ago', avatar: 'E' },
    { name: 'Frank White', email: 'frank.w@example.com', status: 'Inactive', time: '1 week ago', avatar: 'F' },
];

const scanOrigins = [
    { country: 'United States', scans: 1540 },
    { country: 'Germany', scans: 890 },
    { country: 'Brazil', scans: 670 },
    { country: 'Japan', scans: 450 },
    { country: 'Australia', scans: 320 },
    { country: 'India', scans: 280 },
];

const recentActivity = [
    { text: 'QR Code "Product Launch" scanned in Berlin.', time: '5 minutes ago' },
    { text: 'New user "Sophie Miller" registered.', time: '15 minutes ago' },
    { text: 'QR Code "Event Ticket" generated successfully.', time: '1 hour ago' },
    { text: 'User "John Doe" updated profile details.', time: '2 hours ago' },
    { text: 'Analytics report for March generated.', time: '4 hours ago' },
    { text: 'Admin user "Mark S." logged in.', time: '1 day ago' },
];

const Home: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openChart, setOpenChart] = useState<string | null>(null);
    const [openUser, setOpenUser] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'error' }>({ open: false, message: '' });
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [scanDialogOpen, setScanDialogOpen] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);

    // Sidebar/nav handlers
    const handleSidebarNav = (path: string) => {
        navigate(path);
    };
    const handleNavbarNav = (path: string) => {
        navigate(path);
    };

    // Quick Actions
    const handleQuickAction = (action: string) => {
        if (action === 'generateQR') setOpenDialog('generateQR');
        else if (action === 'addUser') setOpenDialog('addUser');
        else if (action === 'viewReports') navigate('/analytics');
        else if (action === 'settings') navigate('/settings');
    };

    // Stat cards
    const handleStatClick = (path: string) => {
        navigate(path);
    };

    // Charts
    const handleChartClick = (chart: string) => {
        setOpenChart(chart);
    };

    // User details
    const handleUserClick = (user: any) => {
        setOpenUser(user);
    };

    // QR Tools
    const handleQRTool = (action: string) => {
        if (action === 'generateQR') setOpenDialog('generateQR');
        else if (action === 'scanHistory') navigate('/scan-reports');
        else if (action === 'manageCampaigns') setOpenDialog('manageCampaigns');
    };

    // Activity
    const handleActivityClick = (activity: any) => {
        setSnackbar({ open: true, message: activity.text, severity: 'info' });
    };

    // Footer subscribe
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setSnackbar({ open: true, message: 'Subscribed successfully!', severity: 'success' });
        setSubscribeEmail('');
    };

    const navLinks = [
        { text: 'Dashboard', path: '/' },
        { text: 'Users', path: '/users' },
        { text: 'QR Codes', path: '/qr-tools' },
        { text: 'Reports', path: '/analytics' },
    ];

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            {/* Top AppBar */}
            <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#fff', color: '#222', borderBottom: '1px solid #eee', zIndex: 1201 }}>
                <Toolbar sx={{ minHeight: 72, px: 4 }}>
                    <QrCodeIcon sx={{ color: '#7c3aed', mr: 1, fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#7c3aed', mr: 4, fontSize: 22 }}>
                        Admin Hub
                    </Typography>
                    {navLinks.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Button
                                key={item.text}
                                onClick={() => handleNavbarNav(item.path)}
                                sx={{
                                    fontWeight: isActive ? 700 : 500,
                                    color: isActive ? '#7c3aed' : '#222',
                                    borderBottom: isActive ? '2px solid #7c3aed' : '2px solid transparent',
                                    borderRadius: 0,
                                    mx: 2,
                                    background: 'none',
                                    boxShadow: 'none',
                                    minWidth: 0,
                                    px: 2,
                                }}
                            >
                                {item.text}
                            </Button>
                        );
                    })}
                    <Box sx={{ flex: 1 }} />
                    <Paper sx={{ display: 'flex', alignItems: 'center', px: 1, mr: 2, borderRadius: 2, bgcolor: '#f3f6fa', boxShadow: 0 }}>
                        <SearchIcon sx={{ color: '#bbb', mr: 1 }} />
                        <InputBase placeholder="Search users, QR codes, or reports..." sx={{ width: 220, fontSize: 15 }} />
                    </Paper>
                    <Button variant="contained" sx={{ bgcolor: '#7c3aed', color: '#fff', borderRadius: 2, boxShadow: 0, textTransform: 'none', fontWeight: 600, fontSize: 15 }} startIcon={<QrCodeIcon />} onClick={() => setScanDialogOpen(true)}>
                        Scan QR Code
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#fff',
                        borderRight: '1px solid #eee',
                        pt: 2,
                        px: 1,
                    },
                }}
            >
                <Toolbar sx={{ minHeight: 72 }} />
                <List>
                    {sidebarItems.map((item, idx) => (
                        <ListItem button key={item.text} selected={location.pathname === item.path} sx={{ borderRadius: 2, mb: 0.5, bgcolor: location.pathname === item.path ? '#f3f0ff' : 'inherit', px: 2 }} onClick={() => handleSidebarNav(item.path)}>
                            <ListItemIcon sx={{ color: location.pathname === item.path ? '#7c3aed' : '#888', minWidth: 36 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 500, color: location.pathname === item.path ? '#7c3aed' : '#222', fontSize: 15 }} />
                            {idx === 1 && <Chip label="12" size="small" sx={{ bgcolor: '#ede9fe', color: '#7c3aed', fontWeight: 700, ml: 1 }} />}
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ p: 2, borderTop: '1px solid #eee', textAlign: 'center' }}>
                    <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: '#7c3aed', width: 48, height: 48, fontWeight: 700 }}>A</Avatar>
                    <Typography variant="body2" fontWeight={600}>Admin User</Typography>
                    <Typography variant="caption" color="text.secondary">admin@example.com</Typography>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ ml: `${drawerWidth}px`, pt: 10, pb: 4, px: 4, bgcolor: '#fafbfc', minHeight: '100vh' }}>
                <Grid container spacing={3}>
                    {/* Welcome Card */}
                    <Grid item xs={12}>
                        <Card sx={{ display: 'flex', alignItems: 'center', p: 0, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)', overflow: 'hidden', minHeight: 180 }}>
                            <Box sx={{ flex: 1, p: 4, background: 'linear-gradient(90deg, #ede9fe 0%, #f3e8ff 100%)' }}>
                                <Typography variant="h4" fontWeight={700} gutterBottom color="#7c3aed">
                                    Welcome, Admin!
                                </Typography>
                                <Typography color="text.secondary" fontSize={17}>
                                    Your comprehensive hub for managing QR codes, users, and monitoring key analytics.
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, height: '100%' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
                                    alt="Dashboard Visual"
                                    style={{ width: '100%', height: 180, objectFit: 'cover' }}
                                />
                            </Box>
                        </Card>
                    </Grid>

                    {/* Stat Cards */}
                    {stats.map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.label}>
                            <Card sx={{ p: 3, textAlign: 'left', borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)', border: '1px solid #f3f0ff', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 24px 0 rgba(140, 140, 255, 0.12)' } }} onClick={() => handleStatClick(stat.path)}>
                                <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                                <Typography color="text.secondary" fontSize={15}>{stat.label}</Typography>
                                <Typography color="success.main" fontSize={13}>{stat.change}</Typography>
                            </Card>
                        </Grid>
                    ))}

                    {/* Charts */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: 320, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 24px 0 rgba(140, 140, 255, 0.12)' } }} onClick={() => handleChartClick('dailyActiveUsers')}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Daily Active Users
                            </Typography>
                            <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.400', borderRadius: 2, bgcolor: '#f8f7fc' }}>
                                <Typography variant="caption">[Chart Placeholder]</Typography>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: 320, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 24px 0 rgba(140, 140, 255, 0.12)' } }} onClick={() => handleChartClick('monthlyScans')}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Monthly QR Code Scans
                            </Typography>
                            <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.400', borderRadius: 2, bgcolor: '#f8f7fc' }}>
                                <Typography variant="caption">[Chart Placeholder]</Typography>
                            </Box>
                        </Card>
                    </Grid>

                    {/* User Registrations & QR Scan Origins */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)', mb: 3 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Recent User Registrations
                                </Typography>
                                <Button size="small" endIcon={<ArrowForwardIosIcon fontSize="small" />} sx={{ color: '#7c3aed', fontWeight: 600, textTransform: 'none' }} onClick={() => navigate('/users')}>View All Users</Button>
                            </Box>
                            {recentUsers.map((user) => (
                                <Box key={user.email} display="flex" alignItems="center" mb={1.5} sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f3f0ff' } }} onClick={() => handleUserClick(user)}>
                                    <Avatar sx={{ bgcolor: user.status === 'Active' ? 'success.main' : user.status === 'Pending' ? 'warning.main' : 'grey.400', mr: 2, width: 36, height: 36, fontWeight: 700 }}>{user.avatar}</Avatar>
                                    <Box flex={1}>
                                        <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                    </Box>
                                    <Chip label={user.status} size="small" sx={{ bgcolor: user.status === 'Active' ? '#e0f7e9' : user.status === 'Pending' ? '#fffbe6' : '#f3f6fa', color: user.status === 'Active' ? '#22c55e' : user.status === 'Pending' ? '#eab308' : '#888', fontWeight: 700, mr: 1 }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 70, textAlign: 'right' }}>{user.time}</Typography>
                                </Box>
                            ))}
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Top QR Scan Origins
                            </Typography>
                            <List>
                                {scanOrigins.map((origin) => (
                                    <ListItem key={origin.country} disableGutters sx={{ py: 0.5 }}>
                                        <ListItemText primary={origin.country} primaryTypographyProps={{ fontSize: 15 }} />
                                        <Typography variant="body2" fontWeight={600}>{origin.scans}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)', mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                QR Code Tools
                            </Typography>
                            {qrTools.map((tool) => (
                                <Box key={tool.text} mb={2}>
                                    <Button variant="text" color="primary" fullWidth sx={{ justifyContent: 'flex-start', color: '#7c3aed', fontWeight: 600, textTransform: 'none', fontSize: 15, mb: 0.5 }} onClick={() => handleQRTool(tool.action)}>
                                        {tool.text}
                                    </Button>
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        {tool.desc}
                                    </Typography>
                                </Box>
                            ))}
                        </Card>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Recent Activity
                            </Typography>
                            {recentActivity.map((activity, idx) => (
                                <Box key={idx} sx={{ mb: 2, display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f3f0ff' } }} onClick={() => handleActivityClick(activity)}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f43f5e', mr: 1 }} />
                                    <Box>
                                        <Typography variant="body2">{activity.text}</Typography>
                                        <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Card>
                    </Grid>
                </Grid>

                {/* Dialogs and Snackbars */}
                <Dialog open={!!openChart} onClose={() => setOpenChart(null)} maxWidth="md" fullWidth>
                    <DialogTitle>{openChart === 'dailyActiveUsers' ? 'Daily Active Users' : 'Monthly QR Code Scans'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.400', borderRadius: 2, bgcolor: '#f8f7fc' }}>
                            <Typography variant="caption">[Large Chart Placeholder]</Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenChart(null)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={!!openUser} onClose={() => setOpenUser(null)} maxWidth="xs" fullWidth>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogContent>
                        {openUser && (
                            <Box>
                                <Avatar sx={{ bgcolor: openUser.status === 'Active' ? 'success.main' : openUser.status === 'Pending' ? 'warning.main' : 'grey.400', width: 56, height: 56, mb: 2 }}>{openUser.avatar}</Avatar>
                                <Typography variant="h6">{openUser.name}</Typography>
                                <Typography color="text.secondary">{openUser.email}</Typography>
                                <Chip label={openUser.status} sx={{ bgcolor: openUser.status === 'Active' ? '#e0f7e9' : openUser.status === 'Pending' ? '#fffbe6' : '#f3f6fa', color: openUser.status === 'Active' ? '#22c55e' : openUser.status === 'Pending' ? '#eab308' : '#888', fontWeight: 700, mt: 1 }} />
                                <Typography variant="caption" color="text.secondary" display="block" mt={2}>Last active: {openUser.time}</Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenUser(null)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDialog === 'generateQR'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Generate QR Code</DialogTitle>
                    <DialogContent>
                        <Typography>QR Code generation form goes here (placeholder).</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(null)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDialog === 'addUser'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogContent>
                        <Typography>User creation form goes here (placeholder).</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(null)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDialog === 'manageCampaigns'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Manage Campaigns</DialogTitle>
                    <DialogContent>
                        <Typography>Campaign management tools go here (placeholder).</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(null)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Scan QR Code</DialogTitle>
                    <DialogContent>
                        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
                            <QrReader
                                constraints={{ facingMode: 'environment' }}
                                onResult={(result, error) => {
                                    if (!!result) {
                                        setScanResult(result.getText());
                                        setScanDialogOpen(false);
                                    } else if (error) {
                                        if (error.name !== 'NotFoundException') {
                                            setScanResult('Error scanning QR code.');
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setScanDialogOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={!!scanResult} autoHideDuration={4000} onClose={() => setScanResult(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={() => setScanResult(null)} severity={scanResult === 'Error scanning QR code.' ? 'error' : 'success'} sx={{ width: '100%' }}>
                        {scanResult}
                    </Alert>
                </Snackbar>

                <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity || 'info'} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default Home;
