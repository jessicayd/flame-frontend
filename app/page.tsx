// @ts-nocheck
'use client';

import { useFileProcessing } from "./hooks/useFileProcessing";
import { useFileNavigators } from "./hooks/useFileNavigators";
import { Box, Typography } from "@mui/material";
import UploadForm from "./components/UploadForm";
import TableMapping from "./components/TableMapping";
import DownloadReady from "./components/DownloadReady";

export default function Home() {
  const {
    isUploaded,
    setIsUploaded,  
    tables,
    setTables,
    mappings,
    setMappings,
    currentTableIndex,
    setCurrentTableIndex,
    filePath,
    setFilePath,
    isDownloadComplete,
    setIsDownloadComplete,
    handleUpload,
    handleDownloadCSV,
  } = useFileProcessing();  

  const {
    selectedFile,
    useOCR,
    setUseOCR,
    handleFileChange,
    handleMappingChange,
    handleNextTable,
    handlePrevTable,
    handleReset,
  } = useFileNavigators();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Typography variant="h3" gutterBottom>COINS PDF EXTRACTOR</Typography>

      {!isUploaded && !isDownloadComplete && (
        <UploadForm
          handleFileChange={handleFileChange}
          handleUpload={(event) => {
            event.preventDefault(); 
            handleUpload(selectedFile, useOCR);
          }}
          useOCR={useOCR}
          setUseOCR={setUseOCR}
        />
      )}

      {isUploaded && tables.length > 0 && !isDownloadComplete && (
        <TableMapping 
          tables={tables}
          currentTableIndex={currentTableIndex}
          mappings={mappings}
          handleMappingChange={(header, selectedPlaceholder) => handleMappingChange(currentTableIndex, mappings, setMappings, header, selectedPlaceholder)}
          predefinedOptions={["ID", "Name", "Latitude", "Longitude", "Start_Year", "End_Year", "Num_Coins_Found", "Reference", "Comment", "External_Link"]}
          handlePrevTable={() => handlePrevTable(currentTableIndex, setCurrentTableIndex)}
          handleNextTable={() => handleNextTable(currentTableIndex, setCurrentTableIndex, tables)}
          handleDownloadCSV={() => handleDownloadCSV(tables, mappings)}
          handleReset={() => handleReset(setIsUploaded, setTables, setMappings, setCurrentTableIndex, setUseOCR, setFilePath, setIsDownloadComplete)}
        />
      )}

      {!isUploaded && isDownloadComplete && filePath && (
        <DownloadReady filePath={filePath} handleReset={() => handleReset(setIsUploaded, setTables, setMappings, setCurrentTableIndex, setUseOCR, setFilePath, setIsDownloadComplete)} />
      )}
    </Box>
  );
}
