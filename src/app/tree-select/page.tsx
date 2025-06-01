"use client";

import { Container, Typography, Box } from '@mui/material';
import SelectTreeBreadcrumb from '../../components/tree-select/index';

export default function TreeSelectPage() {
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
      
      <SelectTreeBreadcrumb />
    </Container>
  );
}
