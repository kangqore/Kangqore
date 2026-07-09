import React, { useEffect, useState } from 'react';
import { koreService, KoreObject } from './koreService';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add as AddIcon, Hub as HubIcon } from '@mui/icons-material';

export const OntologyStudio: React.FC = () => {
  const [objects, setObjects] = useState<KoreObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newObjName, setNewObjName] = useState('');
  const [newObjDesc, setNewObjDesc] = useState('');

  const fetchObjects = async () => {
    setLoading(true);
    try {
      const data = await koreService.getObjects();
      setObjects(data);
    } catch (e) {
      console.error('Failed to fetch KoreObjects', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleCreateObject = async () => {
    try {
      await koreService.createObject({ name: newObjName, description: newObjDesc });
      setCreateDialogOpen(false);
      setNewObjName('');
      setNewObjDesc('');
      fetchObjects();
    } catch (e) {
      console.error('Failed to create object', e);
    }
  };

  return (
    <Box p={3} bgcolor="gray.900" minHeight="100vh" color="white">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <HubIcon sx={{ fontSize: 40, color: '#6366f1' }} />
          <Typography variant="h4" fontWeight="bold">Ontology Studio</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
          onClick={() => setCreateDialogOpen(true)}
        >
          New Entity
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={10}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', color: 'white' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'gray.400' }}>Entity Name</TableCell>
                <TableCell sx={{ color: 'gray.400' }}>Description</TableCell>
                <TableCell sx={{ color: 'gray.400' }}>Type</TableCell>
                <TableCell sx={{ color: 'gray.400' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {objects.map((obj) => (
                <TableRow key={obj.id}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{obj.name}</TableCell>
                  <TableCell sx={{ color: 'gray.300' }}>{obj.description}</TableCell>
                  <TableCell>
                    {obj.isSystem ? (
                      <Chip label="System" size="small" sx={{ bgcolor: '#475569', color: 'white' }} />
                    ) : (
                      <Chip label="Dynamic" size="small" sx={{ bgcolor: '#059669', color: 'white' }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" href={`#/kangqore-view/admin/ontology-studio/${obj.name}`}>
                      Design
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white' } }}>
        <DialogTitle>Create New Entity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Entity Name (e.g. Employee)"
            type="text"
            fullWidth
            variant="outlined"
            value={newObjName}
            onChange={(e) => setNewObjName(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'gray' } }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newObjDesc}
            onChange={(e) => setNewObjDesc(e.target.value)}
            sx={{ input: { color: 'white' }, label: { color: 'gray' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} sx={{ color: 'gray' }}>Cancel</Button>
          <Button onClick={handleCreateObject} variant="contained" sx={{ bgcolor: '#4f46e5' }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OntologyStudio;
