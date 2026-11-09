import { createContext, useContext } from 'react';

/** Where an entity editor runs: the sidebar (an `h6` title, the `EditorRail`), or a form
 *  page of its own (an `h1` title, text buttons and a sticky Save / Cancel footer, #280). */
export const EditorHostContext = createContext<'sidebar' | 'page'>('sidebar');

/** The editor runs on a form page of its own. */
export const useEditorOnPage = (): boolean => useContext(EditorHostContext) === 'page';

/**
 * How a view-mode field locks: `readOnly` on a form page (#267: read, not greyed out),
 * `disabled` in the sidebar.
 *
 * @param {'view' | 'edit'} mode the editor's mode
 * @returns {{ readOnly?: true; disabled?: true }} props to spread on a field
 */
export const useFieldLock = (mode: 'view' | 'edit'): { readOnly?: true; disabled?: true } => {
  const page = useEditorOnPage();
  return mode === 'view' ? (page ? { readOnly: true } : { disabled: true }) : {};
};
