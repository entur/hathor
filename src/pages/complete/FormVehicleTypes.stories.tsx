import type { Meta, StoryObj } from '@storybook/react-vite';
import { APP_STORY_META, AppAt } from './appStory.tsx';

const meta: Meta = { title: 'pages/Form/vehicle-types', ...APP_STORY_META };
export default meta;

/** The whole app on a vehicle type's form page: Header, Menu, form, picture + table of contents. */
export const Complete: StoryObj = {
  render: () => <AppAt path="/next/vehicle-types/NMR%3AVehicleType%3A1" />,
};
