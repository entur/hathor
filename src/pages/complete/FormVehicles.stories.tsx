import type { Meta, StoryObj } from '@storybook/react-vite';
import { APP_STORY_META, AppAt } from './appStory.tsx';

const meta: Meta = { title: 'pages/Form/vehicles', ...APP_STORY_META };
export default meta;

/** The whole app on a vehicle's form page: Header, Menu, form, picture + table of contents. */
export const Complete: StoryObj = {
  render: () => <AppAt path="/next/vehicles/NMR%3AVehicle%3Abus-1" />,
};
