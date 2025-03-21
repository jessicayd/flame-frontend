import { useState } from "react";

export function useFileNavigators() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useOCR, setUseOCR] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleMappingChange = (currentTableIndex: number, mappings: any, setMappings: any, header: string, selectedPlaceholder: string) => {
    setMappings((prev: any) => ({
      ...prev,
      [currentTableIndex]: { ...prev[currentTableIndex], [header]: selectedPlaceholder },
    }));
  };

  const handleNextTable = (currentTableIndex: number, setCurrentTableIndex: any, tables: any) => {
    if (currentTableIndex < tables.length - 1) {
      setCurrentTableIndex(currentTableIndex + 1);
    }
  };

  const handlePrevTable = (currentTableIndex: number, setCurrentTableIndex: any) => {
    if (currentTableIndex > 0) {
      setCurrentTableIndex(currentTableIndex - 1);
    }
  };

  const handleReset = (setIsUploaded: any, setTables: any, setMappings: any, setCurrentTableIndex: any, setUseOCR: any, setFilePath: any, setIsDownloadComplete: any) => {
    setSelectedFile(null);
    setIsUploaded(false);
    setTables([]);
    setMappings({});
    setCurrentTableIndex(0);
    setUseOCR(false);
    setFilePath(null);
    setIsDownloadComplete(false);
  };

  return {
    selectedFile,
    useOCR,
    setUseOCR,
    handleFileChange,
    handleMappingChange,
    handleNextTable,
    handlePrevTable,
    handleReset,
  };
}
