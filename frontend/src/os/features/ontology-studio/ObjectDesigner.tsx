import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { koreService, KoreObject } from './koreService';
import { Box, Typography, Button, Paper, Grid, Card, CardContent, Divider, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Label as LabelIcon, Bolt as BoltIcon } from '@mui/icons-material';

export const ObjectDesigner: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [objectDef, setObjectDef] = useState<KoreObject | null>(null);
  const [propDialogOpen, setPropDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  // New Property State
  const [newPropName, setNewPropName] = useState('');
  const [newPropType, setNewPropType] = useState('STRING');
  const [newPropRequired, setNewPropRequired] = useState(false);

  // New Action State
  const [newActionName, setNewActionName] = useState('');
  const [newActionDesc, setNewActionDesc] = useState('');

  const loadDefinition = async () => {
    if (!name) return;
    try {
      const data = await koreService.getObject(name);
      setObjectDef(data);
    } catch (e) {
      console.error('Failed to load object definition');
    }
  };

  useEffect(() => {
    loadDefinition();
  }, [name]);

  const handleAddProperty = async () => {
    if (!name) return;
    await koreService.addProperty(name, {
      name: newPropName,
      type: newPropType,
      isRequired: newPropRequired,
      isUnique: false
    });
    setPropDialogOpen(false);
    loadDefinition();
  };

  const handleAddAction = async () => {
    if (!name) return;
    await koreService.addAction(name, {
      name: newActionName,
      description: newActionDesc,
      permissions: ['ADMIN']
    });
    setActionDialogOpen(false);
    loadDefinition();
  };

  if (!objectDef) return <Box p={4} color="white">Loading...</Box>;

  return (
    <Box p={3} bgcolor="gray.900" minHeight="100vh" color="white">
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/kangqore-view/admin/ontology-studio')} sx={{ color: 'gray.400' }}>Back</Button>
        <Typography variant="h4" fontWeight="bold">Designer: {objectDef.name}</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Properties Column */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#1e293b', color: 'white', minHeight: '60vh' }}>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <LabelIcon sx={{ color: '#10b981' }} />
                <Typography variant="h6">Properties</Typography>
              </Box>
              <Button size="small" variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#059669' }} onClick={() => setPropDialogOpen(true)}>Add Property</Button>
            </Box>
            <Divider sx={{ bgcolor: 'gray.700', mb: 3 }} />
            
            <Box display="flex" flexDirection="column" gap={2}>
              {objectDef.properties?.map(prop => (
                <Card key={prop.id} sx={{ bgcolor: '#334155', color: 'white' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight="bold">{prop.name}</Typography>
                      <Chip label={prop.type} size="small" sx={{ bgcolor: '#475569', color: 'white' }} />
                    </Box>
                    <Typography variant="caption" color="gray.400">
                      {prop.isRequired ? 'Required' : 'Optional'} {prop.isUnique ? ' • Unique' : ''}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              {(!objectDef.properties || objectDef.properties.length === 0) && (
                <Typography color="gray.500">No properties defined.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Actions Column */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#1e293b', color: 'white', minHeight: '60vh' }}>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <BoltIcon sx={{ color: '#f59e0b' }} />
                <Typography variant="h6">Actions</Typography>
              </Box>
              <Button size="small" variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#d97706' }} onClick={() => setActionDialogOpen(true)}>Add Action</Button>
            </Box>
            <Divider sx={{ bgcolor: 'gray.700', mb: 3 }} />

            <Box display="flex" flexDirection="column" gap={2}>
              {objectDef.actions?.map(action => (
                <Card key={action.id} sx={{ bgcolor: '#334155', color: 'white' }}>
                  <CardContent>
                    <Typography fontWeight="bold">{action.name}</Typography>
                    <Typography variant="body2" color="gray.400" mb={1}>{action.description}</Typography>
                    <Box display="flex" gap={1}>
                      {action.permissions.map(p => (
                        <Chip key={p} label={p} size="small" sx={{ bgcolor: '#94a3b8' }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {(!objectDef.actions || objectDef.actions.length === 0) && (
                <Typography color="gray.500">No actions defined.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Property Dialog */}
      <Dialog open={propDialogOpen} onClose={() => setPropDialogOpen(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white' } }}>
        <DialogTitle>Add Property to {objectDef.name}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Property Name (e.g. status)" fullWidth variant="outlined" value={newPropName} onChange={e => setNewPropName(e.target.value)} sx={{ mb: 2, input: { color: 'white' }, label: { color: 'gray' } }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'gray' }}>Type</InputLabel>
            <Select value={newPropType} onChange={e => setNewPropType(e.target.value as string)} sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'gray.700' } }}>
              <MenuItem value="STRING">String</MenuItem>
              <MenuItem value="NUMBER">Number</MenuItem>
              <MenuItem value="BOOLEAN">Boolean</MenuItem>
              <MenuItem value="DATE">Date</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPropDialogOpen(false)} sx={{ color: 'gray' }}>Cancel</Button>
          <Button onClick={handleAddProperty} variant="contained" sx={{ bgcolor: '#059669' }}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white' } }}>
        <DialogTitle>Add Action to {objectDef.name}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Action Name (e.g. approve)" fullWidth variant="outlined" value={newActionName} onChange={e => setNewActionName(e.target.value)} sx={{ mb: 2, input: { color: 'white' }, label: { color: 'gray' } }} />
          <TextField margin="dense" label="Description" fullWidth variant="outlined" value={newActionDesc} onChange={e => setNewActionDesc(e.target.value)} sx={{ input: { color: 'white' }, label: { color: 'gray' } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)} sx={{ color: 'gray' }}>Cancel</Button>
          <Button onClick={handleAddAction} variant="contained" sx={{ bgcolor: '#d97706' }}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ObjectDesigner;
