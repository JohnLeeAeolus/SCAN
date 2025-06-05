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
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DownloadIcon from '@mui/icons-material/Download';
import { QrReader } from 'react-qr-reader';
import * as XLSX from 'xlsx';

interface AttendanceRecord {
    id: string;
    value: string;
    date: string;
    time: string;
}

const Attendance: React.FC = () => {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [scanDialogOpen, setScanDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'error' }>({ open: false, message: '' });

    const handleScan = (result: string) => {
        const now = new Date();
        setRecords([
            ...records,
            {
                id: result.split('-')[0] || 'Unknown', // Placeholder: extract ID/name from QR
                value: result,
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString(),
            },
        ]);
        setSnackbar({ open: true, message: 'Attendance recorded!', severity: 'success' });
    };

    const handleDownload = () => {
        const ws = XLSX.utils.json_to_sheet(records);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
        XLSX.writeFile(wb, 'attendance.xlsx');
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 6, mb: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom color="#7c3aed">
                Attendance
            </Typography>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(140, 140, 255, 0.06)' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center" mb={2}>
                        <Grid item xs={12} md={6}>
                            <Button variant="contained" startIcon={<QrCodeIcon />} sx={{ bgcolor: '#7c3aed', color: '#fff', borderRadius: 2, fontWeight: 600 }} onClick={() => setScanDialogOpen(true)}>
                                Scan QR Code
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6} textAlign={{ xs: 'left', md: 'right' }}>
                            <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: 2, fontWeight: 600 }} onClick={handleDownload} disabled={records.length === 0}>
                                Download Excel
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name/ID</TableCell>
                                    <TableCell>Scan Value</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {records.map((rec, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{rec.id}</TableCell>
                                        <TableCell>{rec.value}</TableCell>
                                        <TableCell>{rec.date}</TableCell>
                                        <TableCell>{rec.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
                        <QrReader
                            constraints={{ facingMode: 'environment' }}
                            onResult={(result, error) => {
                                if (!!result) {
                                    handleScan(result.getText());
                                    setScanDialogOpen(false);
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

export default Attendance; 