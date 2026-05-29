import type React from 'react';
import { SimpleEditor } from './SimpleEditor.js';
import type { VehicleType } from './vehicleTypeTypes.js';

export interface EditorProps {
  value: Partial<VehicleType>;
  onChange: (next: Partial<VehicleType>) => void;
}

export function Editor({ value, onChange }: EditorProps): React.JSX.Element {
  return (
    <>
      <SimpleEditor value={value} onChange={onChange} />
    </>
  );
}
