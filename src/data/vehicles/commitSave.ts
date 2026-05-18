/**
 * Run a save and chain a side-effectful refresh onto its success. The
 * returned promise resolves only after `onSaved` completes, so callers
 * that flip UI state on success (snackbar, mode) know the list is
 * already fresh by the time the user sees the success signal
 * (M4, PR #74 review).
 *
 * On error (`result.error` truthy), `onSaved` is skipped and the result
 * is returned unchanged.
 */
export interface SaveResult {
  error?: string | null;
}

export async function commitSave<TForm, TResult extends SaveResult>(
  save: (form: TForm) => Promise<TResult>,
  form: TForm,
  onSaved?: () => Promise<void> | void
): Promise<TResult> {
  const result = await save(form);
  if (!result.error && onSaved) await onSaved();
  return result;
}
