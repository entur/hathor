import type { Meta, StoryObj } from '@storybook/react-vite';
import { APP_STORY_META, AppAt } from './appStory.tsx';

const meta: Meta = { title: 'pages/Grid/vehicle-types', ...APP_STORY_META };
export default meta;

/** The whole app on the vehicle-type collection: Header, Menu, toolbar, grid, pager. */
export const Complete: StoryObj = { render: () => <AppAt path="/next/vehicle-types" /> };
