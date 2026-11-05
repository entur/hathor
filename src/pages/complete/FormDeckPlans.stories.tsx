import type { Meta, StoryObj } from '@storybook/react-vite';
import { APP_STORY_META, AppAt } from './appStory.tsx';

const meta: Meta = { title: 'pages/Form/deck-plans', ...APP_STORY_META };
export default meta;

/** The whole app on a deck plan's form page: Header, Menu, form; no decks (no XML stub). */
export const Complete: StoryObj = {
  render: () => <AppAt path="/next/deck-plans/NMR%3ADeckPlan%3A1" />,
};
