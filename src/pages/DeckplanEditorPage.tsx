import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function DeckplanEditorPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/deckplan-editor/netex-deckplan-editor.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/deckplan-editor/netex-deckplan-editor.es.js';
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  if (!loaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <deckplan-editor />;
}
