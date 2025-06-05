import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Chip,
    Snackbar,
    Alert,
    Avatar,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import QrCodeIcon from '@mui/icons-material/QrCode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { QrReader } from 'react-qr-reader';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const initialUsers = [
    { name: 'Alice Johnson', email: 'alice.j@example.com', status: 'Active', lastActive: '2 hours ago', avatar: 'A' },
    { name: 'Bob Williams', email: 'bob.w@example.com', status: 'Inactive', lastActive: '1 day ago', avatar: 'B' },
    { name: 'Charlie Brown', email: 'charlie.b@example.com', status: 'Active', lastActive: '30 mins ago', avatar: 'C' },
    { name: 'Diana Smith', email: 'diana.s@example.com', status: 'Pending', lastActive: '5 hours ago', avatar: 'D' },
    { name: 'Eve Davis', email: 'eve.d@example.com', status: 'Active', lastActive: '2 days ago', avatar: 'E' },
    { name: 'Frank White', email: 'frank.w@example.com', status: 'Inactive', lastActive: '1 week ago', avatar: 'F' },
];

interface AttendanceRecord {
    name: string;
    date: string;
    time: string;
    cluster: string;
    location: string;
}

type AttendanceMap = {
    [email: string]: AttendanceRecord[];
};

interface Folder {
    name: string;
    attendance: AttendanceRecord[];
}

const Users: React.FC = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolderIdx, setSelectedFolderIdx] = useState<number | null>(null);
    const [addFolderDialogOpen, setAddFolderDialogOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [scanDialogOpen, setScanDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [folderDialogOpen, setFolderDialogOpen] = useState(false);
    const [newAttendanceValue, setNewAttendanceValue] = useState('');
    const [newAttendanceCluster, setNewAttendanceCluster] = useState('');
    const [newAttendanceLocation, setNewAttendanceLocation] = useState('');
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'error' }>({ open: false, message: '' });

    // Add Folder
    const handleAddFolder = () => {
        if (!newFolderName.trim()) {
            setSnackbar({ open: true, message: 'Please enter a folder name.', severity: 'error' });
            return;
        }
        setFolders((prev) => [...prev, { name: newFolderName, attendance: [] }]);
        setNewFolderName('');
        setAddFolderDialogOpen(false);
        setSnackbar({ open: true, message: 'Folder added!', severity: 'success' });
    };

    // Attendance logic for selected folder
    const attendanceRecords = selectedFolderIdx !== null ? folders[selectedFolderIdx].attendance : [];

    const handleScan = (result: string) => {
        if (selectedFolderIdx === null) return;
        const now = new Date();
        const newRecord = {
            name: result,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            cluster: 'Default Cluster',
            location: 'Default Location',
        };
        setFolders((prev) => prev.map((f, idx) => idx === selectedFolderIdx ? { ...f, attendance: [...f.attendance, newRecord] } : f));
        setSnackbar({ open: true, message: 'Attendance recorded!', severity: 'success' });
        setScanDialogOpen(false);
    };

    const handleAddAttendance = () => {
        if (selectedFolderIdx === null) return;
        if (!newAttendanceValue.trim()) {
            setSnackbar({ open: true, message: 'Please enter a name.', severity: 'error' });
            return;
        }
        const now = new Date();
        const newRecord = {
            name: newAttendanceValue,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            cluster: newAttendanceCluster,
            location: newAttendanceLocation,
        };
        setFolders((prev) => prev.map((f, idx) => idx === selectedFolderIdx ? { ...f, attendance: [...f.attendance, newRecord] } : f));
        setSnackbar({ open: true, message: 'Attendance added!', severity: 'success' });
        setNewAttendanceValue('');
        setNewAttendanceCluster('');
        setNewAttendanceLocation('');
        setAddDialogOpen(false);
    };

    const handleDeleteAttendance = (index: number) => {
        if (selectedFolderIdx === null) return;
        setFolders((prev) => prev.map((f, idx) => idx === selectedFolderIdx ? { ...f, attendance: f.attendance.filter((_, i) => i !== index) } : f));
        setSnackbar({ open: true, message: 'Attendance deleted!', severity: 'success' });
    };

    const handleDownloadAttendance = () => {
        if (attendanceRecords.length === 0) return;
        const ws = XLSX.utils.json_to_sheet(attendanceRecords);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
        XLSX.writeFile(wb, `${folders[selectedFolderIdx!].name}_attendance.xlsx`);
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 6, mb: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom color="#7c3aed">
                Attendance Folders
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ bgcolor: '#7c3aed', color: '#fff', borderRadius: 3, fontWeight: 700, textTransform: 'none', fontSize: 18, px: 3, py: 1 }}
                    onClick={() => setAddFolderDialogOpen(true)}
                >
                    ADD FOLDER
                </Button>
                {folders.map((folder, idx) => (
                    <Button
                        key={folder.name}
                        variant={selectedFolderIdx === idx ? 'contained' : 'outlined'}
                        startIcon={<FolderOpenIcon />}
                        sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none', fontSize: 18, px: 3, py: 1, bgcolor: selectedFolderIdx === idx ? '#ede9fe' : undefined, color: selectedFolderIdx === idx ? '#7c3aed' : undefined }}
                        onClick={() => setSelectedFolderIdx(idx)}
                    >
                        {folder.name}
                    </Button>
                ))}
            </Box>
            {selectedFolderIdx !== null && (
                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center" mb={2}>
                            <Grid item xs={12} md={6}>
                                <Button variant="contained" startIcon={<QrCodeIcon />} sx={{ bgcolor: '#7c3aed', color: '#fff', borderRadius: 2, fontWeight: 600, mr: 2 }} onClick={() => setScanDialogOpen(true)}>
                                    Scan QR Code
                                </Button>
                                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#7c3aed', color: '#fff', borderRadius: 2, fontWeight: 600 }} onClick={() => setAddDialogOpen(true)}>
                                    Add Attendance
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6} textAlign={{ xs: 'left', md: 'right' }}>
                                <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: 2, fontWeight: 600 }} onClick={handleDownloadAttendance} disabled={attendanceRecords.length === 0}>
                                    Download Excel
                                </Button>
                            </Grid>
                        </Grid>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Cluster</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceRecords.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">No attendance records yet.</TableCell>
                                        </TableRow>
                                    ) : (
                                        attendanceRecords.map((rec, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{rec.name}</TableCell>
                                                <TableCell>{rec.date}</TableCell>
                                                <TableCell>{rec.time}</TableCell>
                                                <TableCell>{rec.cluster}</TableCell>
                                                <TableCell>{rec.location}</TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => handleDeleteAttendance(idx)}
                                                        sx={{ borderRadius: 2, fontWeight: 600 }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
            {/* Add Folder Dialog */}
            <Dialog open={addFolderDialogOpen} onClose={() => setAddFolderDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Add Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Folder Name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddFolderDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddFolder} variant="contained" sx={{ bgcolor: '#7c3aed', color: '#fff' }}>Save</Button>
                </DialogActions>
            </Dialog>
            {/* Add Attendance Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Attendance</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={newAttendanceValue}
                        onChange={(e) => setNewAttendanceValue(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Cluster"
                        value={newAttendanceCluster}
                        onChange={(e) => setNewAttendanceCluster(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Location"
                        value={newAttendanceLocation}
                        onChange={(e) => setNewAttendanceLocation(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddAttendance} variant="contained" sx={{ bgcolor: '#7c3aed', color: '#fff' }}>Save</Button>
                </DialogActions>
            </Dialog>
            {/* Scan QR Dialog */}
            <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
                        <QrReader
                            constraints={{ facingMode: 'environment' }}
                            onResult={(result, error) => {
                                if (!!result) {
                                    handleScan(result.getText());
                                } else if (error) {
                                    if (error.name !== 'NotFoundException') {
                                        setSnackbar({ open: true, message: 'Error scanning QR code.', severity: 'error' });
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
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity || 'info'} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Users; 