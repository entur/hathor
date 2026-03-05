import type React from 'react';
import type { VehicleType } from './generated/types.js';

export interface SimpleEditorProps {
  value: Partial<VehicleType>;
  onChange: (next: Partial<VehicleType>) => void;
}

export function SimpleEditor({ value, onChange }: SimpleEditorProps): React.JSX.Element {
  void onChange;
  return <>{value.Name?.[0]?.Value ?? ''}</>;
}
