// @ts-nocheck
'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [tables, setTables] = useState<{ headers: string[]; table_data: any[] }[]>([]);
  const [mappings, setMappings] = useState<{ [key: number]: { [key: string]: string } }>({});
  const [currentTableIndex, setCurrentTableIndex] = useState(0);
  const [useOCR, setUseOCR] = useState(false);
  const predefinedOptions = ["placeholder1", "placeholder2", "placeholder3"];
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDownloadComplete, setIsDownloadComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const API_BASE = 'http://127.0.0.1:5000';

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('useOCR', useOCR.toString());

    try {
      const response = await fetch(`${API_BASE}/api/extract-tables`, {
        method: 'POST',
        body: formData,
      });

      const jsonResponse = await response.json();
      if (!jsonResponse.success) {
        alert('Failed to extract tables.');
        return;
      }

      setTables(jsonResponse.tables);

      // Initialize mappings for each table
      setMappings(
        jsonResponse.tables.reduce((acc, table, index) => {
          acc[index] = table.headers.reduce((subAcc, header) => {
            subAcc[header] = ""; // Default empty mapping
            return subAcc;
          }, {} as { [key: string]: string });
          return acc;
        }, {} as { [key: number]: { [key: string]: string } })
      );

      setIsUploaded(true);
    } catch (error) {
      console.error('Error extracting tables:', error);
    }
  };

  const handleMappingChange = (header: string, selectedPlaceholder: string) => {
    setMappings((prev) => ({
      ...prev,
      [currentTableIndex]: { ...prev[currentTableIndex], [header]: selectedPlaceholder },
    }));
  };

  const handleNextTable = () => {
    if (currentTableIndex < tables.length - 1) {
      setCurrentTableIndex(currentTableIndex + 1);
    }
  };

  const handlePrevTable = () => {
    if (currentTableIndex > 0) {
      setCurrentTableIndex(currentTableIndex - 1);
    }
  };

  const handleDownloadCSV = async (event) => {
    event.preventDefault();

    try {
        const formattedTables = tables.map((table, idx) => {
            const orderedColumns = table.headers;
            const reorderedData = table.table_data.map(row => {
                const newRow = {};
                orderedColumns.forEach(col => {
                    newRow[col] = row[col];
                });
                return newRow;
            });

            return {
                headers: orderedColumns,
                table_data: reorderedData,
                header_mappings: mappings[idx],
            };
        });

        const response = await fetch(`${API_BASE}/api/export-csv`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tables: formattedTables }),
        });

        if (!response.ok) throw new Error('Failed to download CSVs');

        const jsonResponse = await response.json(); 

        setIsUploaded(false);
        setFilePath(jsonResponse.file_path); 
        setIsDownloadComplete(true); 
    } catch (error) {
        console.error('Error exporting CSVs:', error);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsUploaded(false);
    setTables([]);
    setMappings({});
    setCurrentTableIndex(0);
    setUseOCR(false);
    setFilePath(null);
    setIsDownloadComplete(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Typography variant="h3" gutterBottom>COINS PDF EXTRACTOR</Typography>

      {!isUploaded && !isDownloadComplete && (
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
      )}

      {isUploaded && tables.length > 0 && !isDownloadComplete && (
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
                <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={(event) => handleDownloadCSV(event)}>
                  Export All Tables as CSV
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleReset}>
                  Submit Another PDF
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      
      {!isUploaded && isDownloadComplete && filePath && (
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
      )}

    </Box>
  );
}
