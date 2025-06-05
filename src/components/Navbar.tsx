import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    useTheme,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Paper,
    InputBase,
    Snackbar,
    Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AddIcon from '@mui/icons-material/Add';
import { QrReader } from 'react-qr-reader';

interface NavbarProps {
    onLogout?: () => void;
}

const navLinks = [
    { text: 'Dashboard', path: '/' },
    { text: 'Users', path: '/users' },
    { text: 'QR Codes', path: '/qr-tools' },
    { text: 'Reports', path: '/analytics' },
];

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [scanDialogOpen, setScanDialogOpen] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        setLogoutDialogOpen(false);
        if (onLogout) onLogout();
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    const handleNav = (path: string) => {
        navigate(path);
        setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ width: 240 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <QrCodeIcon sx={{ color: '#7c3aed', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#7c3aed' }}>
                    Admin Hub
                </Typography>
            </Box>
            <List>
                {navLinks.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={() => handleNav(item.path)}
                            selected={location.pathname === item.path}
                        >
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {onLogout && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogoutClick}>
                            <LogoutIcon sx={{ mr: 1 }} />
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static" sx={{ bgcolor: '#fff', color: '#222', boxShadow: 0, borderBottom: '1px solid #eee', zIndex: 1201 }}>
                <Toolbar sx={{ minHeight: 72, px: 4 }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <QrCodeIcon sx={{ color: '#7c3aed', mr: 1, fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#7c3aed', mr: 4, fontSize: 22 }}>
                        Admin Hub
                    </Typography>
                    {!isMobile && navLinks.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Button
                                key={item.text}
                                onClick={() => handleNav(item.path)}
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
                    {!isMobile && (
                        <>
                            <Paper sx={{ display: 'flex', alignItems: 'center', px: 1, mr: 2, borderRadius: 2, bgcolor: '#f3f6fa', boxShadow: 0 }}>
                                <InputBase placeholder="Search users, QR codes, or reports..." sx={{ width: 220, fontSize: 15 }} />
                            </Paper>
                            <Button variant="contained" sx={{ bgcolor: '#7c3aed', color: '#fff', borderRadius: 2, boxShadow: 0, textTransform: 'none', fontWeight: 600, fontSize: 15, mr: 2 }} startIcon={<QrCodeIcon />} onClick={() => setScanDialogOpen(true)}>
                                Scan QR Code
                            </Button>
                            {onLogout && (
                                <Button
                                    color="inherit"
                                    startIcon={<LogoutIcon />}
                                    onClick={handleLogoutClick}
                                    sx={{ px: 2, ml: 1, alignSelf: 'center' }}
                                >
                                    Logout
                                </Button>
                            )}
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                {drawer}
            </Drawer>
            <Dialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
            >
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to log out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
                        Logout
                    </Button>
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
        </>
    );
};

export default Navbar; 