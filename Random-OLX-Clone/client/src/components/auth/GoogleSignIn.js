import React, { useState } from 'react';
import { Button, Box, Text } from '@chakra-ui/react';

// DEMO MODE: Replace Google OAuth with a simple "Demo Login" button
// No real OAuth — just sets dummy user data directly in localStorage
function GoogleSignIn({ isVisible = true }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isVisible) return null;

  const handleDemoLogin = () => {
    setIsLoading(true);
    // Simulate a brief loading state for UX
    setTimeout(() => {
      localStorage.setItem('authToken', 'demo-token-no-auth-needed');
      localStorage.setItem('authemail', 'senior@college.edu');
      localStorage.setItem('authname', 'Senior Student');
      localStorage.setItem('authphone', '9999999999');
      localStorage.setItem('authpicture', '');
      window.location.href = '/';
    }, 600);
  };

  return (
    <Box w="full">
      <Button
        w="full"
        size="lg"
        bg="white"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="xl"
        h="52px"
        fontWeight="600"
        color="gray.700"
        leftIcon={
          <Text fontSize="20px" role="img" aria-label="college">🎓</Text>
        }
        isLoading={isLoading}
        loadingText="Signing in..."
        onClick={handleDemoLogin}
        _hover={{
          borderColor: '#667eea',
          bg: 'purple.50',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 15px rgba(102,126,234,0.2)',
        }}
        _active={{ transform: 'translateY(0)' }}
        transition="all 0.2s"
      >
        Continue as Senior Student (Demo)
      </Button>
      <Text textAlign="center" fontSize="xs" color="gray.400" mt={2}>
        🔓 Demo mode — no password required
      </Text>
    </Box>
  );
}

export default GoogleSignIn;