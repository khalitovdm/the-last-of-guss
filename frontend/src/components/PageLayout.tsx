import { Box, Paper, Typography, Divider } from '@mui/material';
import React from 'react';

interface PageLayoutProps {
  title: string;
  headerContent?: React.ReactNode;
  titleAlign?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const PageLayout = ({ title, headerContent, titleAlign = 'left', children }: PageLayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: '100%',
          maxWidth: '800px',
          minHeight: '650px',
          maxHeight: '650px',
          border: '1px solid rgba(76, 175, 80, 0.4)',
          boxShadow: '0 0 15px rgba(76, 175, 80, 0.3)',
          backdropFilter: 'blur(5px)',
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1, textAlign: titleAlign }}>
            {title}
          </Typography>
          {headerContent && <Box>{headerContent}</Box>}
        </Box>
        <Divider sx={{ bgcolor: 'rgba(76, 175, 80, 0.4)' }} />
        <Box sx={{ 
          p: 4, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflowY: 'auto',
          minHeight: 0,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 10, 0, 0.5)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.main',
            borderRadius: '4px',
            border: '1px solid rgba(76, 175, 80, 0.7)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'text.primary',
          },
        }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}; 