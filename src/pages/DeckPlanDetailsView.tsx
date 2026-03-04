import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CircularProgress, TextareaAutosize } from '@mui/material';
import { useAuth } from '../auth';
import { useConfig } from '../contexts/configContext';
import {
  fetchDeckPlanDetails,
  saveDeckPlanAsNetexToBackend,
} from '../data/deck-plans/deckPlanDetailsService';

const DeckPlanDetailsView = () => {
  const { id } = useParams();
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as Error | null);
  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();
  const navigate = useNavigate();

  const save = async () => {
    try {
      if (!applicationImportBaseUrl) return;
      const token = await getAccessToken();
      await saveDeckPlanAsNetexToBackend(applicationImportBaseUrl, data, token);
      alert('Deck plan saved successfully!');
      navigate('/deck-plans');
    } catch (err) {
      alert(`Error saving deck plan: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!id) return;
        if (!applicationImportBaseUrl) return;

        const token = await getAccessToken();

        const data = await fetchDeckPlanDetails(applicationImportBaseUrl, id, token);
        setData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, applicationImportBaseUrl, getAccessToken]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => save()}>
        Save Deck Plan
      </Button>
      <TextareaAutosize
        aria-label="deck plan data"
        value={data}
        onChange={event => setData(event.target.value)}
        minRows={3}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          borderColor: 'rgba(0, 0, 0, 0.23)',
          borderWidth: '1px',
          borderStyle: 'solid',
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
        }}
      />
    </div>
  );
};

export default DeckPlanDetailsView;
