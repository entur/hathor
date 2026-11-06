import type { Decorator } from '@storybook/react-vite';
import { ConfigContext, useConfig } from './configContext.ts';

/** Sobek's base URL in a story: only the stub below answers it. */
export const STORY_SOBEK_URL = 'https://sobek.story/';

/**
 * Decorator pointing a story's runtime config at {@link STORY_SOBEK_URL}, so data
 * hooks (`useVehicleTypes`, a record read) run instead of waiting for a base URL.
 *
 * @returns a decorator wrapping the story in the config with that base URL.
 */
export const withSobekUrl = (): Decorator =>
  function WithSobekUrl(Story) {
    return (
      <ConfigContext.Provider value={{ ...useConfig(), applicationBaseUrl: STORY_SOBEK_URL }}>
        <Story />
      </ConfigContext.Provider>
    );
  };

/**
 * A story's `beforeEach`: answer GraphQL posts to {@link STORY_SOBEK_URL} from
 * `answers`, keyed by a substring of the query (e.g. `vehicleTypes`); anything
 * else goes to the real `fetch`. Hand it wire-shaped bodies — the e2e fixtures.
 *
 * @param answers query substring → the JSON body Sobek would send.
 * @returns the `beforeEach`, whose cleanup restores `fetch`.
 */
export const stubSobek = (answers: Record<string, unknown>) => () => {
  const real = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!url.startsWith(STORY_SOBEK_URL)) return real(input, init);
    const query: string = JSON.parse(String(init?.body ?? '{}')).query ?? '';
    const hit = Object.entries(answers).find(([op]) => query.includes(op));
    return Response.json(hit ? hit[1] : { data: null, errors: [{ message: 'not stubbed' }] });
  };
  return () => {
    globalThis.fetch = real;
  };
};
