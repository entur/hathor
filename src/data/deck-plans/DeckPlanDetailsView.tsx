import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextareaAutosize } from '@mui/material';
import LoadingPage from '../../components/common/LoadingPage';
import ErrorPage from '../../components/common/ErrorPage';
import { useAuth } from '../../auth';
import { useConfig } from '../../contexts/configContext';
import { fetchDeckPlanDetails, saveDeckPlanAsNetexToBackend } from './deckPlanDetailsService';
import GenericDetailsPage from '../../pages/GenericDetailsPage';
import { DeckPlanEditor } from '../../components/deckplan/DeckPlanEditor';
import dpe from '@opentrainticketing/netex-deckplan-editor';
import type { Deck } from '@opentrainticketing/netex-deckplan-editor';

const DeckPlanDetailsView = () => {
  const { id } = useParams();
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [myDeck, setMyDeck] = useState<Deck | null>(null);
  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setFetchError(null);
        if (!id) return;
        if (!applicationImportBaseUrl) return;

        const token = await getAccessToken();

        const data = await fetchDeckPlanDetails(applicationImportBaseUrl, id, token);
        setData(data);
      } catch (error) {
        setFetchError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, applicationImportBaseUrl, getAccessToken]);

  useEffect(() => {
    if (!data) {
      setMyDeck(null);
      return;
    }
    const pd = dpe.parseNeTEx(data);
    const deckPlan = pd.length > 0 ? pd[0] : undefined;
    if (!deckPlan) {
      setMyDeck(null);
      return;
    }
    const decks = deckPlan.decks;
    if (!Array.isArray(decks) || decks.length === 0) {
      setMyDeck(null);
      return;
    }
    setMyDeck(decks[0] ?? null);
  }, [data]);

  if (loading) {
    return <LoadingPage />;
  }

  if (fetchError) {
    return <ErrorPage message={fetchError.message} />;
  }

  const handleSave = async () => {
    if (!applicationImportBaseUrl) throw new Error('Import base URL not configured');
    const token = await getAccessToken();
    await saveDeckPlanAsNetexToBackend(applicationImportBaseUrl, data, token);
    navigate('/deck-plan');
  };

  return (
    <GenericDetailsPage
      title="Deck Plan"
      onSave={handleSave}
      saveDisabled={!applicationImportBaseUrl}
    >
      {myDeck && <DeckPlanEditor deck={myDeck} />}
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
    </GenericDetailsPage>
  );
};

export default DeckPlanDetailsView;
