import { useState } from "react";
import mock_image from './mock_image.png';

const MOCK_MODE = false;

export function useFileProcessing() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [tables, setTables] = useState<{ headers: string[]; table_data: any[] }[]>([]);
  const [mappings, setMappings] = useState<{ [key: number]: { [key: string]: string } }>({});
  const [currentTableIndex, setCurrentTableIndex] = useState(0);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDownloadComplete, setIsDownloadComplete] = useState(false);

  const mockExtractTablesResponse = {
    success: true,
    tables: [
      {
        headers: ["ID", "Name", "Latitude", "Longitude"], 
        table_data: [
          { ID: "1", Name: "Coin A", Latitude: "40.7128", Longitude: "-74.0060" },
          { ID: "2", Name: "Coin B", Latitude: "34.0522", Longitude: "-118.2437" }
        ],
        image: mock_image
      }
    ]
  };

  const mockDownloadResponse = {
    file_path: "/mock/path/to/tables.zip",
  };

  const handleUpload = async (selectedFile: File, useOCR: boolean) => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    if (MOCK_MODE) {
      console.log("Mock Mode: Returning dummy tables");
      setTables(mockExtractTablesResponse.tables);

      setMappings(
        mockExtractTablesResponse.tables.reduce((acc, table, index) => {
          acc[index] = table.headers.reduce((subAcc, header) => {
            subAcc[header] = ""; 
            return subAcc;
          }, {} as { [key: string]: string });
          return acc;
        }, {} as { [key: number]: { [key: string]: string } })
      );


      setIsUploaded(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("useOCR", useOCR.toString());

    try {
      const response = await fetch('/api/extract-tables', {
        method: "POST",
        body: formData,
      });

      const jsonResponse = await response.json();
      if (!jsonResponse.success) {
        alert("Failed to extract tables.");
        return;
      }

      console.log("API Response:", jsonResponse);

      setTables(jsonResponse.tables);

      setMappings(
        jsonResponse.tables.reduce((acc, table, index) => {
          acc[index] = table.headers.reduce((subAcc, header) => {
            subAcc[header] = ""; 
            return subAcc;
          }, {} as { [key: string]: string });
          return acc;
        }, {} as { [key: number]: { [key: string]: string } })
      );

      setIsUploaded(true);
    } catch (error) {
      console.error("Error extracting tables:", error);
    }
  };

  const handleDownloadCSV = async (tables: any, mappings: any) => {
    if (MOCK_MODE) {
      console.log("Mock Mode: Returning mock download path");
      setIsUploaded(false);
      setFilePath(mockDownloadResponse.file_path);
      setIsDownloadComplete(true);
      return;
    }

    try {
      const formattedTables = tables
        .map((table: any, idx: number) => {
          if (table.include === false) return null; // skip excluded tables
  
          const orderedColumns = table.headers;
          const reorderedData = table.table_data.map((row: any) => {
            const newRow: { [key: string]: any } = {};
            orderedColumns.forEach((col: string) => {
              newRow[col] = row[col];
            });
            return newRow;
          });
  
          return {
            headers: orderedColumns,
            table_data: reorderedData,
            header_mappings: mappings[idx],
          };
        })
        .filter(Boolean); // remove nulls
  
      if (formattedTables.length === 0) {
        alert("No tables selected for export.");
        return;
      }

      const response = await fetch('/api/export-csv', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tables: formattedTables }),
      });

      if (!response.ok) throw new Error("Failed to download CSVs");

      const jsonResponse = await response.json();

      setIsUploaded(false);
      setFilePath(jsonResponse.file_path);
      setIsDownloadComplete(true);
    } catch (error) {
      console.error("Error exporting CSVs:", error);
    }
  };


  return {
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
  };
}
