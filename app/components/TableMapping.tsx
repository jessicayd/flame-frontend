import { Box, Button, Typography, Card, CardContent, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const TableMapping = ({ tables, currentTableIndex, mappings, handleMappingChange, predefinedOptions, handlePrevTable, handleNextTable, handleDownloadCSV, handleReset }) => {
  return (
    <Card sx={{ maxWidth: 600, width: '100%', mt: 4 }}>
      <CardContent>
        <Typography variant="h4">Table {currentTableIndex + 1} of {tables.length}</Typography>
        
        {tables[currentTableIndex].headers.map((header) => (
          <FormControl key={header} fullWidth sx={{ my: 2 }}>
            <InputLabel>{header}</InputLabel>
            <Select
              value={mappings[currentTableIndex][header] || ""}
              onChange={(e) => handleMappingChange(header, e.target.value)}
            >
              <MenuItem value="">(Keep Original)</MenuItem>
              {predefinedOptions.map((placeholder) => (
                <MenuItem key={placeholder} value={placeholder}>{placeholder}</MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" onClick={handlePrevTable} disabled={currentTableIndex === 0}>
            Previous Table
          </Button>

          <Button variant="contained" onClick={handleNextTable} disabled={currentTableIndex === tables.length - 1}>
            Next Table
          </Button>
        </Box>

        {currentTableIndex === tables.length - 1 && (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleDownloadCSV}>
              Export All Tables as CSV
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              Submit Another PDF
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TableMapping;
