import { useState } from 'react'
import { Box, Container, Typography } from '@mui/material'
import NavBar from './components/NavBar'

function App() {

  return (
    <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh' }}>
    
      <NavBar />
      <Container
      maxWidth="sm"
      sx={{ 
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to the App
        </Typography>
      </Container>
    </Box>
  )
}

export default App
