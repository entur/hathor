import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import EditorFrame, { type EditorCopy } from './EditorFrame.tsx';
import { FormPage, STORY_SAVE_MS } from './formPageStory.tsx';
import { withOrganisations } from '../../contexts/mockOrganisations.tsx';
import { withSobekUrl } from '../../contexts/mockSobek.tsx';
import { useEntityEditor, type EntityEditorHostProps } from '../../hooks/useEntityEditor.ts';
import DeckPlanSections from '../../data/deck-plans/components/DeckPlanSections.tsx';
import { deckPlanForm } from '../../data/deck-plans/stores/deckPlanFormState.ts';
import type { DeckPlan } from '../../data/deck-plans/types/deckPlanTypes.ts';
import wagon1Raw from '../../../story-fixtures/deck-plans/Wagon_1.xml?raw';

const CREATED_ID = 'NMR:DeckPlan:2';
const SKELETON_ROWS = 2;

const COPY: EditorCopy = {
  title: 'deckPlans.detailsTitle',
  notFound: 'deckPlans.notFound',
  saved: 'deckPlans.saveSuccess',
  deactivated: 'deckPlan.deactivateSuccess',
  deactivateTitle: 'deckPlan.deactivateConfirmTitle',
  deactivateMessage: 'deckPlan.deactivateConfirmMessage',
};

/** `Wagon_1.xml`'s plan, under a full NeTEx id (the editor's export carries `DeckPlan/id/1`). */
const DECK_PLAN: DeckPlan = {
  id: 'NMR:DeckPlan:1',
  version: 1,
  name: { value: 'Wagon 1' },
  description: { value: 'Regional wagon, one deck' },
};
const wagon1 = wagon1Raw.replace(/"DeckPlan\/id\/1"/g, `"${DECK_PLAN.id}"`);
/** Stands in for Sobek's deck plans: a save lands here, so a create's redirect reads it back. */
const store = new Map([[DECK_PLAN.id, DECK_PLAN]]);

/** `DeckPlanDetails` on its form page, with the in-memory store and a fixed body in place of Sobek. */
function StoryDeckPlanDetails(host: EntityEditorHostProps) {
  const editor = useEntityEditor({
    ...host,
    fetchById: async id => store.get(id) ?? null,
    formState: deckPlanForm,
    write: form =>
      new Promise(done =>
        setTimeout(() => {
          const id = form.id || CREATED_ID;
          store.set(id, { ...form, id });
          done({ error: null, newId: id });
        }, STORY_SAVE_MS)
      ),
    withNewId: (form, id) => ({ ...form, id, version: 1 }),
    deactivateRequest: async () => {},
  });
  const { form } = editor;
  return (
    <EditorFrame
      editor={editor}
      entity={form}
      testId="deck-plan"
      copy={COPY}
      skeleton={SKELETON_ROWS}
    >
      <DeckPlanSections
        value={form}
        onChange={editor.setForm}
        mode={editor.rail.mode}
        isCreate={editor.isCreate}
        xml={editor.isCreate ? '' : wagon1}
        loading={false}
        fetchError={null}
        onRetry={() => {}}
      />
    </EditorFrame>
  );
}

const deckPlanEditor = (host: EntityEditorHostProps) => <StoryDeckPlanDetails {...host} />;

const meta: Meta = {
  title: 'components/editorFrame/fullpage/deck-plans',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`EditorFrame` on the deck-plan form page (#287): `PageShell` → `EntityDetailsShell` → the frame around the real `DeckPlanSections`, the decks upright in column 3 with a "Show XML" button (a no-op in epic #252). The record read and save hit an in-memory store; the body is `story-fixtures/deck-plans/Wagon_1.xml`.',
      },
    },
  },
  // The editor reads the record once a base URL is set; nothing calls it.
  decorators: [withSobekUrl(), withOrganisations()],
};
export default meta;

type Story = StoryObj;

/** A record opens ready to edit; its decks drawn in column 3. */
export const Edit: Story = {
  render: () => <FormPage entity="deck-plans" id={DECK_PLAN.id} renderEditor={deckPlanEditor} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByTestId('deck-plan-decks')).toBeVisible();
    await expect(canvas.getByTestId('deck-plan-show-xml')).toHaveTextContent('Show XML');
  },
};

/** A create at `/new`: no body yet, so "No decks yet" and no XML button. */
export const Create: Story = {
  render: () => <FormPage entity="deck-plans" id="new" renderEditor={deckPlanEditor} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByTestId('deck-plan-decks-placeholder')).toHaveTextContent(
      'No decks yet'
    );
    await expect(canvas.queryByTestId('deck-plan-show-xml')).toBeNull();
  },
};
