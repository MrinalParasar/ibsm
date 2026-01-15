"use client";

import { useEffect, useState } from "react";

import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
  TableChart as TableIcon,
  GridView as CardsIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import RichTextEditor from "@/components/RichTextEditor";

interface Career {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('careerViewMode') as 'table' | 'cards';
    if (savedMode) setViewMode(savedMode);
  }, []);

  const handleViewChange = (_: any, value: 'table' | 'cards') => {
    if (value) {
      setViewMode(value);
      localStorage.setItem('careerViewMode', value);
    }
  };
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    initializeDefaultCareers();
  }, []);

  useEffect(() => {
    fetchCareers(currentPage);
  }, [currentPage]);

  const initializeDefaultCareers = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      await fetch("/api/admin/init-careers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCareers(1);
    } catch (error) {
      console.error("Failed to initialize careers:", error);
      fetchCareers(1);
    }
  };

  const fetchCareers = async (page: number = 1) => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`/api/admin/careers?page=${page}&limit=9`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCareers(data.careers || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch careers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = (career?: Career) => {
    if (career) {
      setEditingCareer(career);
      setFormData({
        title: career.title,
        location: career.location,
        type: career.type,
        description: career.description,
        requirements: career.requirements.join("\n"),
      });
    } else {
      setEditingCareer(null);
      setFormData({
        title: "",
        location: "",
        type: "",
        description: "",
        requirements: "",
      });
    }
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingCareer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    const requirements = formData.requirements
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    try {
      const url = editingCareer
        ? `/api/admin/careers/${editingCareer._id}`
        : "/api/admin/careers";
      const method = editingCareer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          location: formData.location,
          type: formData.type,
          description: formData.description,
          requirements,
        }),
      });

      if (response.ok) {
        fetchCareers(currentPage);
        handleCloseEditor();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save career");
      }
    } catch (error) {
      console.error("Failed to save career:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career?")) {
      return;
    }

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (careers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchCareers(currentPage);
        }
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete career");
      }
    } catch (error) {
      console.error("Failed to delete career:", error);
    }
  };

  if (isEditorOpen) {
    return (
      <CareerEditor
        formData={formData}
        setFormData={setFormData}
        editingCareer={editingCareer}
        handleCloseEditor={handleCloseEditor}
        handleSubmit={handleSubmit}
      />
    );
  }

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
            Manage Careers
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Add, edit, or delete career listings
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenEditor()}
            sx={{
              px: 3,
              py: 1.5,
              boxShadow: "0 4px 15px rgba(24, 0, 173, 0.3)",
            }}
          >
            Add New Career
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : careers.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            No careers found. Click "Add New Career" to create one.
          </Typography>
        </Card>
      ) : viewMode === 'table' ? (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eeeeee' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(24, 0, 173, 0.05)' }}>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Type</TableCell>
                <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {careers.map((career) => (
                <TableRow
                  key={career._id}
                  sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{career.title}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      {career.location}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={career.type}
                      size="small"
                      sx={{ bgcolor: 'rgba(24, 0, 173, 0.08)', color: 'primary.main', fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditor(career)}
                        sx={{ color: 'primary.main', border: '1px solid rgba(24, 0, 173, 0.2)' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(career._id)}
                        sx={{ color: 'error.main', border: '1px solid rgba(211, 47, 47, 0.2)' }}
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
          {careers.map((career) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={career._id}>
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
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={career.type}
                      size="small"
                      sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600, mb: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {career.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <LocationIcon sx={{ fontSize: 18 }} />
                      <Typography variant="body2">{career.location}</Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6,
                    }}
                  >
                    {career.description}
                  </Typography>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 1 }}>
                      REQUIREMENTS:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2, color: 'text.secondary' }}>
                      {career.requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx}>
                          <Typography variant="caption">{req}</Typography>
                        </li>
                      ))}
                      {career.requirements.length > 3 && (
                        <li>
                          <Typography variant="caption">And {career.requirements.length - 3} more...</Typography>
                        </li>
                      )}
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleOpenEditor(career)}
                    startIcon={<EditIcon />}
                    sx={{ flex: 1, borderColor: 'primary.main', color: 'primary.main' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(career._id)}
                    startIcon={<DeleteIcon />}
                    sx={{ flex: 1 }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 6, alignItems: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Showing page {currentPage} of {totalPages} ({total} total careers)
          </Typography>
        </Stack>
      )}


    </>
  );
}

import { INDIAN_STATES_AND_DISTRICTS } from "@/lib/items/indian-locations";

function CareerEditor({
  formData,
  setFormData,
  editingCareer,
  handleCloseEditor,
  handleSubmit
}: {
  formData: any;
  setFormData: any;
  editingCareer: Career | null;
  handleCloseEditor: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Initialize state/district from existing location if possible
  useEffect(() => {
    if (formData.location) {
      // Try to parse "District, State" format
      const parts = formData.location.split(',').map((p: string) => p.trim());
      if (parts.length === 2) {
        // Assume "District, State"
        const [dist, st] = parts;
        if (INDIAN_STATES_AND_DISTRICTS[st]) {
          setSelectedState(st);
          if (INDIAN_STATES_AND_DISTRICTS[st].includes(dist)) {
            setSelectedDistrict(dist);
          } else {
            setSelectedDistrict(""); // mismatch or free text
          }
        } else {
          // Try "State, Country" or other format? No, let's just default empty if no match
          // actually, maybe parts[0] is state? Let's check keys
          if (INDIAN_STATES_AND_DISTRICTS[parts[1]]) {
            setSelectedState(parts[1]);
            setSelectedDistrict(parts[0]);
          }
        }
      } else if (parts.length === 1 && INDIAN_STATES_AND_DISTRICTS[parts[0]]) {
        setSelectedState(parts[0]);
      }
    }
  }, [editingCareer]); // Only run on mount/edit load - simplified

  // Update formData.location whenever state/district changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      setFormData((prev: any) => ({ ...prev, location: `${selectedDistrict}, ${selectedState}` }));
    } else if (selectedState) {
      setFormData((prev: any) => ({ ...prev, location: selectedState }));
    }
  }, [selectedState, selectedDistrict, setFormData]);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleCloseEditor} sx={{ color: 'primary.main' }}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {editingCareer ? "Edit Career" : "Create New Career"}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {editingCareer ? `Updating: ${editingCareer.title}` : "Fill in the details for the new position"}
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: '1px solid #eeeeee',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Job Title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  variant="outlined"
                  sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                    Job Description (Rich Text)
                  </Typography>
                  <RichTextEditor
                    content={formData.description}
                    onChange={(content) => setFormData({ ...formData, description: content })}
                    minHeight={400}
                    placeholder="Enter detailed job description, responsibilities, and benefits..."
                  />
                  <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', display: 'block' }}>
                    You can add images, lists, and formatting here.
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Requirements (one per line)"
                  required
                  multiline
                  rows={6}
                  placeholder="Enter each requirement on a new line"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  helperText="These will be displayed as a bulleted list"
                  sx={{
                    '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' },
                    '& .MuiInputBase-inputMultiline': { color: 'black !important', WebkitTextFillColor: 'black !important' }
                  }}
                />
              </Stack>
            </Grid>

            {/* Sidebar */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, bgcolor: '#fbfbfb', borderStyle: 'dashed' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>JOB DETAILS</Typography>
                <Stack spacing={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      label="State"
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedDistrict(""); // Reset district on state change
                      }}
                      sx={{ color: 'black', '& .MuiSelect-select': { color: 'black' } }}
                    >
                      {Object.keys(INDIAN_STATES_AND_DISTRICTS).sort().map((state) => (
                        <MenuItem key={state} value={state}>{state}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" disabled={!selectedState}>
                    <InputLabel id="district-label">District/City</InputLabel>
                    <Select
                      labelId="district-label"
                      label="District/City"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      sx={{ color: 'black', '& .MuiSelect-select': { color: 'black' } }}
                    >
                      {selectedState && INDIAN_STATES_AND_DISTRICTS[selectedState]?.sort().map((dist) => (
                        <MenuItem key={dist} value={dist}>{dist}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* Hidden location field to ensure data integrity logic if needed, but handled by useEffect */}

                  <TextField
                    fullWidth
                    label="Job Type"
                    required
                    placeholder="e.g., Full Time, Part Time"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                  />
                </Stack>
              </Paper>

              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCloseEditor}
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    boxShadow: "0 4px 15px rgba(24, 0, 173, 0.3)",
                  }}
                >
                  {editingCareer ? "Update Job" : "Post Job"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
