import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function DeckplanEditorPage() {
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();
  const editorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/deckplan-editor/netex-deckplan-editor.es.js';
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Inject CSS into the web component's shadow DOM instead of globally
  useEffect(() => {
    if (!loaded || !editorRef.current) return;

    const el = editorRef.current;
    const tryInject = () => {
      const shadow = el.shadowRoot;
      if (!shadow) return;
      if (shadow.querySelector('link[data-hathor-injected]')) return;

      // Tailwind v4 uses @property for CSS variable initial values, but
      // @property doesn't apply inside shadow DOM. Patch the critical ones.
      const patch = document.createElement('style');
      patch.textContent = ':host, * { --tw-border-style: solid; --tw-font-weight: initial; }';
      shadow.prepend(patch);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/deckplan-editor/netex-deckplan-editor.css';
      link.setAttribute('data-hathor-injected', '');
      shadow.prepend(link);
    };

    // Shadow root may not be ready immediately — observe until it is
    tryInject();
    if (!el.shadowRoot) {
      const observer = new MutationObserver(() => {
        if (el.shadowRoot) {
          tryInject();
          observer.disconnect();
        }
      });
      observer.observe(el, { childList: true });
      return () => observer.disconnect();
    }
  }, [loaded]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'medium' }}>
        {t('home.features.deckplaneditor.headline')}
      </Typography>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          minHeight: 'calc(100dvh - 200px)',
        }}
      >
        {!loaded ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <deckplan-editor ref={editorRef} />
        )}
      </Paper>
    </Container>
  );
}
