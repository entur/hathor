import { useState } from 'react';
import type React from 'react';
import type { VehicleType } from './generated/types.js';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SimpleEditor } from './SimpleEditor.js';
import { FullEditor } from './FullEditor.js';
import { XmlPreview } from './XmlPreview.js';

export interface EditorProps {
  value: Partial<VehicleType>;
  onChange: (next: Partial<VehicleType>) => void;
}

export function Editor({ value, onChange }: EditorProps): React.JSX.Element {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Edit" />
        <Tab label="Full complexity" />
        <Tab label="XML Preview" />
      </Tabs>
      {tab === 0 && <SimpleEditor value={value} onChange={onChange} />}
      {tab === 1 && <FullEditor value={value} onChange={onChange} />}
      {tab === 2 && <XmlPreview value={value} />}
    </>
  );
}
