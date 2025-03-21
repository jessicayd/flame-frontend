import { Box, Button, TextField, Typography, Card, CardContent, FormControlLabel, Checkbox } from '@mui/material';

const UploadForm = ({ handleFileChange, handleUpload, useOCR, setUseOCR }) => {
  return (
    <Card sx={{ maxWidth: 600, width: '100%' }}>
      <CardContent>
        <form onSubmit={handleUpload}>
          <Box mb={2}>
            <Typography variant="body1">Select a PDF file:</Typography>
            <TextField type="file" fullWidth onChange={handleFileChange} inputProps={{ accept: '.pdf' }} />
          </Box>

          <FormControlLabel
            control={<Checkbox checked={useOCR} onChange={() => setUseOCR(!useOCR)} />}
            label="Run OCR on PDF before extraction"
          />

          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" type="submit">Extract Tables</Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;

