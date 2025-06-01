"use client";

import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import TreeSelect from '../../components/tree-select';

export default function TreeSelectPage() {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const handleChange = (value: string, label: string) => {
    setSelectedValue(value);
    setSelectedLabel(label);
    console.log('Selected:', value, label);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ตัวเลือกแบบ Tree Select
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          กรุณาเลือกรายการจากโครงสร้างด้านล่าง:
        </Typography>
      </Box>

      <TreeSelect
        value={selectedValue}
        onChange={handleChange}
        title="หมวดหมู่"
        placeholder="เลือกหมวดหมู่สินค้า"
      />

      {selectedValue && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="h6">ค่าที่เลือก:</Typography>
          <Typography variant="body1">Value: <strong>{selectedValue}</strong></Typography>
          <Typography variant="body1">Label: <strong>{selectedLabel}</strong></Typography>
        </Box>
      )}
    </Container>
  );
}
