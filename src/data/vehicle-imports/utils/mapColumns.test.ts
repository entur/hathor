import { describe, expect, it } from 'vitest';
import { mapColumns } from './mapColumns';

describe('mapColumns', () => {
  it('reads registrations and operational ids, blank headers included', () => {
    const rows = [
      { Regnr: 'EB12345', '': 'OP-001' },
      { Regnr: ' EB12346 ', '': '' },
      { Regnr: '', '': 'OP-003' },
    ];
    expect(mapColumns(rows, { regNumberCol: 'Regnr', operationalRefCol: '' })).toEqual([
      { queryRegNumber: 'EB12345', operationalRef: 'OP-001' },
      { queryRegNumber: 'EB12346', operationalRef: undefined },
    ]);
  });

  it('reads a blank-header registration column, with no operational id column', () => {
    expect(
      mapColumns([{ Model: 'Volvo 8900', '': 'EB12345' }], {
        regNumberCol: '',
        operationalRefCol: null,
      })
    ).toEqual([{ queryRegNumber: 'EB12345', operationalRef: undefined }]);
  });
});
