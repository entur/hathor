import { useState } from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { Editor, validate } from '@entur/my_vehicletype-editor';
import type { My_VehicleType } from '@entur/my_vehicletype-editor';

export default function VehicleTypeCompletePage() {
  const [value, setValue] = useState<Partial<My_VehicleType>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const handleValidate = () => {
    const result = validate(value);
    setErrors(result.errors);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        VT Complete Editor
      </Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Editor value={value} onChange={setValue} />
      </Paper>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={handleValidate}>
          Validate
        </Button>
      </Box>
      {errors.length > 0 && (
        <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="subtitle2" gutterBottom>
            Validation errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5em' }}>
            {errors.map(e => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Paper>
      )}
    </Container>
  );
}
