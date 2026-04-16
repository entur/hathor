import { useState } from 'react';
import type React from 'react';
import type { Vehicle } from './generated/Vehicle.js';
import type { ExtraTab } from './EditForm.js';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { EditForm } from './EditForm.js';
import { XmlPreview } from './XmlPreview.js';

export interface EditorProps {
  value: Partial<Vehicle>;
  onChange: (next: Partial<Vehicle>) => void;
  extraTabs?: ExtraTab[];
}

export function Editor({ value, onChange, extraTabs }: EditorProps): React.JSX.Element {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Edit" />
        <Tab label="XML Preview" />
      </Tabs>
      {tab === 0 && <EditForm value={value} onChange={onChange} extraTabs={extraTabs} />}
      {tab === 1 && <XmlPreview value={value} />}
    </>
  );
}
