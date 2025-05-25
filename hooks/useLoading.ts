import { useState, useEffect } from 'react';

// Type definition for loading state listeners
type LoadingListener = (isLoading: boolean) => void;

// Global array to store loading state listeners
const loadingListeners: LoadingListener[] = [];

// Function to notify all listeners about loading state changes
export function notifyLoadingChange(isLoading: boolean) {
  console.log(`Loading state changed to: ${isLoading}`);
  loadingListeners.forEach(listener => listener(isLoading));
}

// Hook to track loading state
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Create a handler function for loading state changes
    const handleLoadingChange = (loadingState: boolean) => {
      setIsLoading(loadingState);
    };
    
    // Register the handler
    console.log('useLoading: Adding loading listener');
    loadingListeners.push(handleLoadingChange);
    console.log(`useLoading: Total listeners: ${loadingListeners.length}`);
    
    // Cleanup: remove the listener when component unmounts
    return () => {
      console.log('useLoading: Removing loading listener');
      const index = loadingListeners.indexOf(handleLoadingChange);
      if (index !== -1) {
        loadingListeners.splice(index, 1);
        console.log(`useLoading: Total listeners after removal: ${loadingListeners.length}`);
      } else {
        console.log('useLoading: Listener not found');
      }
    };
  }, []);
  
  return isLoading;
}