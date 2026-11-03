/** What a feature's write returns: an error message, or the id a create minted. */
export interface WriteResult {
  error: string | null;
  newId?: string | null;
}

/** What both flows share. */
export interface FlowCtx {
  t: (key: string) => string;
  /** False once the selection or org this run started for is gone: stop, publish nothing. */
  live: () => boolean;
  toView: () => void;
  /** The host's list reload (`onSaved`); resolves at once when there is no list. */
  reloadList: () => Promise<void>;
  /** Amber snackbar. */
  warn: (message: string) => void;
}

export interface SaveCtx<F> extends FlowCtx {
  isCreate: boolean;
  form: F;
  /** Persist the form; never throws. */
  write: (form: F) => Promise<WriteResult>;
  withNewId: (form: F, newId: string) => F;
  /** Make `form` the committed baseline. */
  rebase: (form: F) => void;
  /** Re-read the record by id; rejects when nothing was read. */
  reread: () => Promise<unknown>;
  /** Red save-error snackbar. */
  fail: (error: string) => void;
  /** Host: move the selection from the create pane to the new id. */
  onCreated: (newId: string) => void;
  /** Green "saved" snackbar. */
  saved: () => void;
}

export interface DeactivateCtx extends FlowCtx {
  deactivate: () => Promise<{ error: string | null }>;
  /** Deactivated, list not refreshed yet: Edit blocked, no green. */
  stale: () => void;
  /** List refreshed: green. */
  ok: () => void;
}

/**
 * The one save sequence every entity editor runs. The form is re-baselined on
 * the write itself, so a failing re-read or list reload can't strand it dirty
 * over a persisted save. "Saved" means the record was re-read (edit) or the
 * list holds the new row (create). `live()` is checked after every await.
 *
 * @param {SaveCtx<F>} c Save context.
 * @returns {Promise<void>} Resolves once the run has published its outcome (or stopped).
 */
export async function runSave<F>(c: SaveCtx<F>): Promise<void> {
  const { error, newId } = await c.write(c.form);
  if (!c.live()) return;
  if (error) return c.fail(error);

  if (c.isCreate) {
    // Sobek must mint an id on create; re-baselining with a blank id would
    // let the next Save fire CREATE again and mint a duplicate.
    if (!newId) return c.warn(c.t('common.saveNoIdReturned'));
    c.rebase(c.withNewId(c.form, newId));
    c.toView();
    try {
      await c.reloadList();
    } catch {
      if (c.live()) c.warn(c.t('common.saveStaleList'));
      return;
    }
    if (!c.live()) return;
    c.onCreated(newId);
    c.saved();
    return;
  }

  c.rebase(c.form);
  c.toView();
  const [reread, list] = await Promise.allSettled([c.reread(), c.reloadList()]);
  if (!c.live() || reread.status === 'rejected') return; // the body shows the read error
  if (list.status === 'rejected') c.warn(c.t('common.saveStaleList'));
  else c.saved();
}

/**
 * The one deactivate sequence: green only after the list reload, Edit blocked
 * (`stale`) in between. `live()` is checked after every await.
 *
 * @param {DeactivateCtx} c Deactivate context.
 * @returns {Promise<void>} Resolves once the run has published its outcome (or stopped).
 */
export async function runDeactivate(c: DeactivateCtx): Promise<void> {
  const { error } = await c.deactivate();
  if (!c.live()) return;
  if (error) return c.warn(error);
  c.toView();
  c.stale();
  try {
    await c.reloadList();
  } catch {
    if (c.live()) c.warn(c.t('common.deactivateStaleList'));
    return;
  }
  if (c.live()) c.ok();
}
