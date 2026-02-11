import { Container, Box, Typography, Paper, useTheme, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EmojiTransportation, ViewInAr } from '@mui/icons-material';

export default function HomePage() {
  const { t } = useTranslation();
  const theme = useTheme();

  const features = [
    {
      icon: <EmojiTransportation fontSize="large" color="primary" />,
      headlineKey: 'home.features.vehicletypes.headline',
      descriptionKey: 'home.features.vehicletypes.description',
      path: '/vehicle-type',
    },
    {
      icon: <ViewInAr fontSize="large" color="primary" />,
      headlineKey: 'home.features.deckplaneditor.headline',
      descriptionKey: 'home.features.deckplaneditor.description',
      path: '/deckplan-editor',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          textAlign: 'center',
          mb: 5,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
        >
          {t('home.welcomeMessage')}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: '70ch', mx: 'auto' }}
        >
          {t('home.description')}
        </Typography>
      </Paper>

      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'medium', mb: 4 }}
        >
          {t('home.features.title')}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map(feature => {
            return (
              <Grid key={feature.headlineKey} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    cursor: feature.path ? 'pointer' : 'default',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                  {...(feature.path ? { component: Link, to: feature.path } : {})}
                >
                  <Box sx={{ mb: 2, color: theme.palette.primary.main }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: 'medium' }}
                  >
                    {t(feature.headlineKey)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {t(feature.descriptionKey)}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}
