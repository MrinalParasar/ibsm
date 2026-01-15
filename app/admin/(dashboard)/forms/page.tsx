"use client";

import { useEffect, useState } from "react";

import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TableChart as TableIcon,
  GridView as CardsIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as MessageIcon,
  Work as WorkIcon,
  PictureAsPdf as PdfIcon,
  OpenInNew as ExternalLinkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

interface FormSubmission {
  _id: string;
  formSource: 'hero-consultation' | 'contact-page' | 'career-application';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  position?: string;
  experience?: string;
  cvUrl?: string;
  cvFileName?: string;
  agreedToTerms?: boolean;
  createdAt: string;
}

interface FormStats {
  total: number;
  bySource: {
    source: string;
    count: number;
  }[];
}

const formSourceLabels: Record<string, string> = {
  'hero-consultation': 'Hero Consultation Form',
  'contact-page': 'Contact Page Form',
  'career-application': 'Career Application Form',
};

export default function AdminFormsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [stats, setStats] = useState<FormStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    const savedMode = localStorage.getItem('formsViewMode') as 'table' | 'cards';
    if (savedMode) setViewMode(savedMode);
  }, []);

  const handleViewChange = (_: any, value: 'table' | 'cards') => {
    if (value) {
      setViewMode(value);
      localStorage.setItem('formsViewMode', value);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedSource === 'all') {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(submissions.filter(s => s.formSource === selectedSource));
    }
  }, [selectedSource, submissions]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/forms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/forms?type=stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleDownloadCSV = () => {
    if (submissions.length === 0) return;

    // Define CSV headers
    const headers = ["Date", "Source", "Name", "Email", "Phone", "Position", "Message/Experience", "CV Link", "Status"];

    // Map data to rows
    const rows = submissions.map(form => [
      `"${new Date(form.createdAt).toLocaleString().replace(/"/g, '""')}"`,
      `"${(formSourceLabels[form.formSource] || form.formSource).replace(/"/g, '""')}"`,
      `"${form.name.replace(/"/g, '""')}"`,
      `"${form.email.replace(/"/g, '""')}"`,
      `"${(form.phone || '').replace(/"/g, '""')}"`,
      `"${(form.position || '').replace(/"/g, '""')}"`,
      `"${(form.message || form.experience || '').replace(/"/g, '""')}"`,
      `"${(form.cvUrl || '').replace(/"/g, '""')}"`,
      // Status is not in the interface, using placeholder or derived if needed. Assuming 'New' or similar if not present, but interface doesn't have it.
      // Let's omit status if not in interface or use a static value?
      // actually interface FormSubmission doesn't have status. I'll remove it from headers.
      // Wait, let's check interface again.
      // Interface has: formSource, name, email, phone, message, position, experience, cvUrl, agreedToTerms.
      // No status.
    ]);

    // Correct headers for actual data
    const csvHeaders = ["Date", "Source", "Name", "Email", "Phone", "Position", "Message/Experience", "CV Link", "Agreed to Terms"];
    const csvRows = submissions.map(form => [
      `"${new Date(form.createdAt).toLocaleString().replace(/"/g, '""')}"`,
      `"${(formSourceLabels[form.formSource] || form.formSource).replace(/"/g, '""')}"`,
      `"${form.name.replace(/"/g, '""')}"`,
      `"${form.email.replace(/"/g, '""')}"`,
      `"${(form.phone || '').replace(/"/g, '""')}"`,
      `"${(form.position || '').replace(/"/g, '""')}"`,
      `"${(form.message || form.experience || '').replace(/"/g, '""')}"`,
      `"${(form.cvUrl || '').replace(/"/g, '""')}"`,
      `"${form.agreedToTerms ? 'Yes' : 'No'}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `form_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/forms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSubmissions(submissions.filter(s => s._id !== id));
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(null);
        }
        fetchStats();
      } else {
        alert("Failed to delete submission");
      }
    } catch (error) {
      console.error("Failed to delete submission:", error);
      alert("An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateFull = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      </>
    );
  }

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
            Form Submissions
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Manage and view all form submissions from your website
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCSV}
            disabled={submissions.length === 0}
            size="small"
          >
            Export CSV
          </Button>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="table" aria-label="table view">
              <TableIcon sx={{ mr: 1 }} /> Table
            </ToggleButton>
            <ToggleButton value="cards" aria-label="cards view">
              <CardsIcon sx={{ mr: 1 }} /> Cards
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>Total Submissions</Typography>
                <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 700 }}>{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {stats.bySource.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.source}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {formSourceLabels[item.source] || item.source}
                  </Typography>
                  <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 700 }}>{item.count}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedSource}
          onChange={(_, value) => setSelectedSource(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`All (${submissions.length})`} value="all" />
          {stats?.bySource.map((item) => (
            <Tab
              key={item.source}
              label={`${formSourceLabels[item.source] || item.source} (${item.count})`}
              value={item.source}
            />
          ))}
        </Tabs>
      </Box>

      {/* Submissions View */}
      {filteredSubmissions.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>No submissions found</Typography>
        </Card>
      ) : viewMode === 'table' ? (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eeeeee' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(24, 0, 173, 0.05)' }}>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Source</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Date</TableCell>
                <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow
                  key={submission._id}
                  sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
                >
                  <TableCell>
                    <Chip
                      label={formSourceLabels[submission.formSource] || submission.formSource}
                      size="small"
                      sx={{ bgcolor: 'rgba(24, 0, 173, 0.12)', color: 'primary.dark', fontSize: '0.7rem', fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.phone || "-"}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    {formatDate(submission.createdAt)}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedSubmission(submission)}
                        sx={{ color: 'primary.main', border: '1px solid rgba(250,192,20,0.3)', '&:hover': { bgcolor: 'primary.main', color: 'black' } }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(submission._id)}
                        sx={{ color: 'error.main', border: '1px solid rgba(255,107,107,0.3)', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {filteredSubmissions.map((submission) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={submission._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      label={formSourceLabels[submission.formSource] || submission.formSource}
                      size="small"
                      sx={{ bgcolor: 'rgba(24, 0, 173, 0.12)', color: 'primary.dark', fontWeight: 600 }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatDate(submission.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {submission.name}
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <EmailIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{submission.email}</Typography>
                    </Box>
                    {submission.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PhoneIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{submission.phone}</Typography>
                      </Box>
                    )}
                    {submission.position && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <WorkIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{submission.position}</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
                <Divider sx={{ borderColor: '#eeeeee' }} />
                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    onClick={() => setSelectedSubmission(submission)}
                    startIcon={<ViewIcon />}
                    sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                  >
                    Details
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(submission._id)}
                    sx={{ minWidth: 'fit-content' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <Dialog
          open={true}
          onClose={() => setSelectedSubmission(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              border: '1px solid #eeeeee',
            }
          }}
        >
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                Submission Details
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatDateFull(selectedSubmission.createdAt)}
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedSubmission(null)} sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: '#eeeeee' }}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedSubmission.name}</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                    Email Address
                  </Typography>
                  <Typography variant="body2">
                    <Button
                      component="a"
                      href={`mailto:${selectedSubmission.email}`}
                      startIcon={<EmailIcon />}
                      sx={{ color: 'text.primary', textTransform: 'none', p: 0, '&:hover': { color: 'primary.main' } }}
                    >
                      {selectedSubmission.email}
                    </Button>
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                    Phone Number
                  </Typography>
                  {selectedSubmission.phone ? (
                    <Typography variant="body2">
                      <Button
                        component="a"
                        href={`tel:${selectedSubmission.phone}`}
                        startIcon={<PhoneIcon />}
                        sx={{ color: 'text.primary', textTransform: 'none', p: 0, '&:hover': { color: 'primary.main' } }}
                      >
                        {selectedSubmission.phone}
                      </Button>
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Not provided</Typography>
                  )}
                </Grid>
              </Grid>

              {selectedSubmission.position && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                    Position Applied
                  </Typography>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(24, 0, 173, 0.05)', borderRadius: 1, border: '1px solid #eeeeee' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedSubmission.position}</Typography>
                  </Box>
                </Box>
              )}

              {(selectedSubmission.message || selectedSubmission.experience) && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                    {selectedSubmission.message ? "Message" : "Experience Details"}
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #eeeeee' }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {selectedSubmission.message || selectedSubmission.experience}
                    </Typography>
                  </Box>
                </Box>
              )}

              {selectedSubmission.cvUrl && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, display: 'block', mb: 1, textTransform: 'uppercase' }}>
                    CV / Resume Attachment
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<PdfIcon />}
                    endIcon={<ExternalLinkIcon />}
                    href={selectedSubmission.cvUrl}
                    target="_blank"
                    fullWidth
                    sx={{ color: 'primary.main', borderColor: 'rgba(24, 0, 173, 0.3)', justifyContent: 'space-between', py: 1.5 }}
                  >
                    {selectedSubmission.cvFileName || "View Attached CV"}
                  </Button>
                </Box>
              )}

              {selectedSubmission.agreedToTerms !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedSubmission.agreedToTerms ? (
                    <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                  ) : (
                    <CancelIcon color="error" sx={{ fontSize: 20 }} />
                  )}
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    User {selectedSubmission.agreedToTerms ? "agreed" : "did not agree"} to Terms & Conditions
                  </Typography>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EmailIcon />}
              fullWidth
              onClick={() => {
                window.location.href = `mailto:${selectedSubmission.email}?subject=Re: Your ${formSourceLabels[selectedSubmission.formSource]} Submission`;
              }}
              sx={{ fontWeight: 700 }}
            >
              Reply via Email
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(selectedSubmission._id)}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
