"use client";

import { Container, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to My Components
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Explore our interactive components
        </Typography>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Link href="/tree-select" passHref>
          <Button variant="contained" size="large">
            เปิด Tree Select Component
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
