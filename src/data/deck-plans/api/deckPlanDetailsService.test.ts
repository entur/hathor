import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveDeckPlanAsNetexToBackend } from './deckPlanDetailsService.ts';

const IMPORT_URL = 'http://sobek/services/vehicles/netex';
const OWNER = 'NMR:Organisation:1';

/**
 * A patched document on its way back to the import endpoint, carrying deck
 * geometry with numeric-looking text: a zero-padded seat label and a dimension
 * with a trailing zero. Both are common in real coach data.
 */
const GEOMETRY_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="2.0:NO-NeTEx:2.0">
    <dataObjects>
        <CompositeFrame version="1" id="NMR:CompositeFrame:1">
            <frames>
                <ResourceFrame version="1" id="NMR:ResourceFrame:1">
                    <deckPlans>
                        <DeckPlan version="2" id="NMR:DeckPlan:1">
                            <Name><Text>Geometry</Text></Name>
                            <decks>
                                <Deck version="1" id="NMR:Deck:1">
                                    <Width>1.10</Width>
                                    <deckSpaces>
                                        <PassengerSpace version="1" id="NMR:PassengerSpace:1">
                                            <Label>007</Label>
                                        </PassengerSpace>
                                    </deckSpaces>
                                </Deck>
                            </decks>
                        </DeckPlan>
                    </deckPlans>
                </ResourceFrame>
            </frames>
        </CompositeFrame>
    </dataObjects>
</PublicationDelivery>`;

/**
 * The import POST re-parses and re-serializes the whole document to graft the
 * owning-organisation ref onto the frame. That round-trip must not rewrite the
 * geometry `patchDeckPlanXml` went out of its way to preserve.
 */
describe('saveDeckPlanAsNetexToBackend', () => {
  let posted = '';

  beforeEach(() => {
    posted = '';
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: { body: string }) => {
        posted = init.body;
        return { ok: true, statusText: 'OK', text: async () => 'imported' };
      })
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it('POSTs a zero-padded seat label verbatim', async () => {
    await saveDeckPlanAsNetexToBackend(IMPORT_URL, OWNER, GEOMETRY_XML, null);
    expect(posted).toContain('<Label>007</Label>');
  });

  it('POSTs a trailing-zero dimension verbatim', async () => {
    await saveDeckPlanAsNetexToBackend(IMPORT_URL, OWNER, GEOMETRY_XML, null);
    expect(posted).toContain('<Width>1.10</Width>');
  });

  it('still grafts the owning organisation onto the frame', async () => {
    await saveDeckPlanAsNetexToBackend(IMPORT_URL, OWNER, GEOMETRY_XML, null);
    expect(posted).toContain(OWNER);
    expect(posted).toContain('NMR:ResponsibilitySet:1');
  });
});
