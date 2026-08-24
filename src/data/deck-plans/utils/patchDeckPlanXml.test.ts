import { describe, it, expect } from 'vitest';
import { XMLParser } from 'fast-xml-parser';
import { patchDeckPlanXml } from './patchDeckPlanXml.ts';

const ID = 'NMR:DeckPlan:1';

/**
 * Verbatim shape of a live Sobek `GET /netex/deckplans/<id>` response
 * (probed 2026-08-20). CompositeFrame-wrapped, `imported-id` keyValues,
 * whitespace-padded `<Text>`, empty `<decks/>`.
 */
const LIVE_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" xmlns:ns2="http://www.opengis.net/gml/3.2" version="2.0:NO-NeTEx:2.0">
    <PublicationTimestamp>2026-08-20T09:30:51.056</PublicationTimestamp>
    <ParticipantRef>NMR</ParticipantRef>
    <dataObjects>
        <CompositeFrame version="1" id="NMR:CompositeFrame:1019481400">
            <FrameDefaults>
                <DefaultLocale><TimeZone>Europe/Oslo</TimeZone></DefaultLocale>
            </FrameDefaults>
            <frames>
                <ResourceFrame version="1" id="NMR:ResourceFrame:839120080">
                    <deckPlans>
                        <DeckPlan changed="2026-06-22T13:27:05.522" modification="new" version="2" id="NMR:DeckPlan:1">
                            <ValidBetween><FromDate>2026-06-22T13:27:05.522</FromDate></ValidBetween>
                            <keyList>
                                <KeyValue><Key>imported-id</Key><Value>AUTOSYS:DeckPlan:e6</Value></KeyValue>
                                <KeyValue><Key>imported-id</Key><Value>AUTOSYS:DeckPlan:e6</Value></KeyValue>
                            </keyList>
                            <Name><Text>
                Enetasjes leddet lavgulvbuss (CG)
              </Text></Name>
                            <Description><Text>VAN HOOL ExquiCity 24</Text></Description>
                            <decks/>
                        </DeckPlan>
                    </deckPlans>
                </ResourceFrame>
            </frames>
        </CompositeFrame>
    </dataObjects>
</PublicationDelivery>`;

/** Flat (non-CompositeFrame) layout — `findResourceFrame`'s other branch. */
const FLAT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <ResourceFrame id="NMR:ResourceFrame:1" version="1">
      <deckPlans>
        <DeckPlan id="NMR:DeckPlan:1" version="1"><Name><Text>Old</Text></Name></DeckPlan>
      </deckPlans>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;

const parser = new XMLParser({ ignoreAttributes: false });
const deckPlanOf = (xml: string) => {
  const dobj = parser.parse(xml).PublicationDelivery?.dataObjects;
  const rf = dobj?.CompositeFrame?.frames?.ResourceFrame ?? dobj?.ResourceFrame;
  return rf.deckPlans.DeckPlan;
};

/**
 * patchDeckPlanXml rewrites Name/Description inside a fetched NeTEx deck-plan
 * document so the whole body (geometry included) can be POSTed back to the
 * import endpoint — the only write path that preserves content DeckPlanInput
 * cannot carry.
 */
describe('patchDeckPlanXml', () => {
  it('rewrites Name and Description text', () => {
    const dp = deckPlanOf(
      patchDeckPlanXml(LIVE_XML, ID, { value: 'Renamed' }, { value: 'New desc' })
    );
    expect(dp.Name.Text).toBe('Renamed');
    expect(dp.Description.Text).toBe('New desc');
  });

  it('trims incoming values so a re-save does not re-pad', () => {
    const dp = deckPlanOf(patchDeckPlanXml(LIVE_XML, ID, { value: '  Padded  ' }, undefined));
    expect(dp.Name.Text).toBe('Padded');
  });

  it('removes Name entirely when the value is blank after trimming', () => {
    // Sobek re-pads <Text> on serialize, so a "blank" name arrives as whitespace.
    const dp = deckPlanOf(patchDeckPlanXml(LIVE_XML, ID, { value: '   ' }, { value: 'kept' }));
    expect(dp.Name).toBeUndefined();
    expect(dp.Description.Text).toBe('kept');
  });

  it('carries the lang attribute when the domain value has one', () => {
    const dp = deckPlanOf(patchDeckPlanXml(LIVE_XML, ID, { value: 'Navn', lang: 'nb' }, undefined));
    expect(dp.Name['@_lang']).toBe('nb');
  });

  it('strips keyList so Sobek does not double it on every write (sobek#180)', () => {
    const dp = deckPlanOf(patchDeckPlanXml(LIVE_XML, ID, { value: 'x' }, undefined));
    expect(dp.keyList).toBeUndefined();
  });

  it('preserves DeckPlan attributes, ValidBetween and decks', () => {
    const dp = deckPlanOf(patchDeckPlanXml(LIVE_XML, ID, { value: 'x' }, undefined));
    expect(dp['@_id']).toBe(ID);
    expect(dp['@_version']).toBe('2');
    expect(dp['@_modification']).toBe('new');
    expect(dp.ValidBetween.FromDate).toBe('2026-06-22T13:27:05.522');
    expect(dp).toHaveProperty('decks');
  });

  it('preserves the surrounding frame envelope', () => {
    const out = patchDeckPlanXml(LIVE_XML, ID, { value: 'x' }, undefined);
    expect(out).toContain('xmlns="http://www.netex.org.uk/netex"');
    expect(out).toContain('NMR:CompositeFrame:1019481400');
    expect(out).toContain('<TimeZone>Europe/Oslo</TimeZone>');
  });

  it('resolves a flat ResourceFrame layout too', () => {
    const dp = deckPlanOf(patchDeckPlanXml(FLAT_XML, ID, { value: 'Flat' }, undefined));
    expect(dp.Name.Text).toBe('Flat');
  });

  it('throws when the document has no matching DeckPlan', () => {
    expect(() => patchDeckPlanXml(LIVE_XML, 'NMR:DeckPlan:999', { value: 'x' }, undefined)).toThrow(
      /NMR:DeckPlan:999/
    );
  });
});
