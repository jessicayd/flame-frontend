import { Box, Button, Typography, Card, CardContent } from '@mui/material';

const DownloadReady = ({ filePath, handleReset }) => {
  return (
    <Card sx={{ maxWidth: 600, width: '100%', mt: 4 }}>
      <CardContent>
        <Typography variant="h3" gutterBottom>Download Complete</Typography>
        <Typography variant="h5">Your CSV file has been saved to:</Typography>
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold', wordBreak: 'break-all' }}>
          {filePath}
        </Typography>

        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Submit Another PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default DownloadReady;
