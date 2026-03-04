import { TRANSPORT_MODES, PROPULSION_TYPES, FUEL_TYPES, FARE_CLASSES } from './generated/types.js';

// ── Field descriptor types ──

type FieldDescriptor =
  | { kind: 'string'; camel: string; xml: string }
  | { kind: 'number'; camel: string; xml: string }
  | { kind: 'boolean'; camel: string; xml: string }
  | { kind: 'enum'; camel: string; xml: string; allowed: readonly string[] }
  | { kind: 'enum[]'; camel: string; xml: string; allowed: readonly string[] }
  | { kind: 'object'; camel: string; xml: string; schema: FieldDescriptor[] }
  | { kind: 'array'; camel: string; xml: string; schema: FieldDescriptor[] };

// ── Sub-schemas ──

const textTypeSchema: FieldDescriptor[] = [
  { kind: 'string', camel: 'value', xml: 'Value' },
  { kind: 'string', camel: 'lang', xml: 'Lang' },
  { kind: 'string', camel: 'textIdType', xml: 'TextIdType' },
];

const privateCodeSchema: FieldDescriptor[] = [
  { kind: 'string', camel: 'value', xml: 'Value' },
  { kind: 'string', camel: 'type', xml: 'Type' },
];

const keyValueSchema: FieldDescriptor[] = [
  { kind: 'string', camel: 'key', xml: 'Key' },
  { kind: 'string', camel: 'value', xml: 'Value' },
  { kind: 'string', camel: 'typeOfKey', xml: 'TypeOfKey' },
];

const passengerCapacitySchema: FieldDescriptor[] = [
  { kind: 'enum', camel: 'fareClass', xml: 'FareClass', allowed: FARE_CLASSES },
  { kind: 'number', camel: 'totalCapacity', xml: 'TotalCapacity' },
  { kind: 'number', camel: 'seatingCapacity', xml: 'SeatingCapacity' },
  { kind: 'number', camel: 'standingCapacity', xml: 'StandingCapacity' },
  { kind: 'number', camel: 'specialPlaceCapacity', xml: 'SpecialPlaceCapacity' },
  { kind: 'number', camel: 'pushchairCapacity', xml: 'PushchairCapacity' },
  { kind: 'number', camel: 'wheelchairPlaceCapacity', xml: 'WheelchairPlaceCapacity' },
  { kind: 'number', camel: 'pramPlaceCapacity', xml: 'PramPlaceCapacity' },
  { kind: 'number', camel: 'bicycleRackCapacity', xml: 'BicycleRackCapacity' },
];

const manoeuvringSchema: FieldDescriptor[] = [
  { kind: 'boolean', camel: 'reversible', xml: 'Reversible' },
  { kind: 'number', camel: 'minimumTurningCircle', xml: 'MinimumTurningCircle' },
  { kind: 'number', camel: 'minimumOvertakingWidth', xml: 'MinimumOvertakingWidth' },
  { kind: 'number', camel: 'minimumLength', xml: 'MinimumLength' },
];

// ── Main schema ──

export const vehicleTypeSchema: FieldDescriptor[] = [
  { kind: 'array', camel: 'name', xml: 'Name', schema: textTypeSchema },
  { kind: 'array', camel: 'shortName', xml: 'ShortName', schema: textTypeSchema },
  { kind: 'array', camel: 'description', xml: 'Description', schema: textTypeSchema },
  { kind: 'object', camel: 'privateCode', xml: 'PrivateCode', schema: privateCodeSchema },
  { kind: 'enum', camel: 'transportMode', xml: 'TransportMode', allowed: TRANSPORT_MODES },
  { kind: 'string', camel: 'deckPlanRef', xml: 'DeckPlanRef' },
  { kind: 'string', camel: 'euroClass', xml: 'EuroClass' },
  { kind: 'boolean', camel: 'reversingDirection', xml: 'ReversingDirection' },
  { kind: 'boolean', camel: 'selfPropelled', xml: 'SelfPropelled' },
  {
    kind: 'enum[]',
    camel: 'propulsionTypes',
    xml: 'PropulsionTypes',
    allowed: PROPULSION_TYPES,
  },
  { kind: 'enum', camel: 'propulsionType', xml: 'PropulsionType', allowed: PROPULSION_TYPES },
  { kind: 'enum[]', camel: 'fuelTypes', xml: 'FuelTypes', allowed: FUEL_TYPES },
  { kind: 'number', camel: 'maximumRange', xml: 'MaximumRange' },
  { kind: 'number', camel: 'maximumVelocity', xml: 'MaximumVelocity' },
  {
    kind: 'object',
    camel: 'passengerCapacity',
    xml: 'PassengerCapacity',
    schema: passengerCapacitySchema,
  },
  { kind: 'string', camel: 'id', xml: 'Id' },
  { kind: 'string', camel: 'includedIn', xml: 'IncludedIn' },
  { kind: 'string', camel: 'classifiedAsRef', xml: 'ClassifiedAsRef' },
  { kind: 'string', camel: 'facilities', xml: 'Facilities' },
  { kind: 'boolean', camel: 'monitored', xml: 'Monitored' },
  { kind: 'boolean', camel: 'lowFloor', xml: 'LowFloor' },
  { kind: 'boolean', camel: 'hasLiftOrRamp', xml: 'HasLiftOrRamp' },
  { kind: 'boolean', camel: 'hasHoist', xml: 'HasHoist' },
  { kind: 'number', camel: 'hoistOperatingRadius', xml: 'HoistOperatingRadius' },
  { kind: 'number', camel: 'boardingHeight', xml: 'BoardingHeight' },
  { kind: 'number', camel: 'gapToPlatform', xml: 'GapToPlatform' },
  { kind: 'number', camel: 'length', xml: 'Length' },
  { kind: 'number', camel: 'width', xml: 'Width' },
  { kind: 'number', camel: 'height', xml: 'Height' },
  { kind: 'number', camel: 'weight', xml: 'Weight' },
  { kind: 'number', camel: 'firstAxleHeight', xml: 'FirstAxleHeight' },
  { kind: 'string', camel: 'canCarry', xml: 'CanCarry' },
  { kind: 'object', camel: 'canManoeuvre', xml: 'CanManoeuvre', schema: manoeuvringSchema },
  {
    kind: 'string',
    camel: 'satisfiesFacilityRequirements',
    xml: 'SatisfiesFacilityRequirements',
  },
  { kind: 'array', camel: 'keyList', xml: 'KeyList', schema: keyValueSchema },
  { kind: 'array', camel: 'privateCodes', xml: 'PrivateCodes', schema: privateCodeSchema },
  { kind: 'string', camel: 'brandingRef', xml: 'BrandingRef' },
  { kind: 'string', camel: 'responsibilitySetRef', xml: 'ResponsibilitySetRef' },
];

// ── Generic helpers ──

function unwrap(val: unknown): unknown {
  if (typeof val === 'object' && val !== null && 'value' in (val as Record<string, unknown>)) {
    return (val as Record<string, unknown>).value;
  }
  return val;
}

export function serializeFields(
  obj: Record<string, unknown>,
  schema: FieldDescriptor[]
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of schema) {
    const val = obj[field.camel];
    if (val === undefined) continue;
    switch (field.kind) {
      case 'string':
      case 'number':
      case 'enum':
      case 'enum[]':
        out[field.xml] = val;
        break;
      case 'boolean':
        out[field.xml] = String(val);
        break;
      case 'object':
        out[field.xml] = serializeFields(val as Record<string, unknown>, field.schema);
        break;
      case 'array':
        out[field.xml] = (val as unknown[]).map(item =>
          serializeFields(item as Record<string, unknown>, field.schema)
        );
        break;
    }
  }
  return out;
}

export function normalizeFields(
  src: Record<string, unknown>,
  schema: FieldDescriptor[]
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of schema) {
    const rawVal = src[field.xml] ?? src[field.camel];
    if (rawVal == null) continue;
    switch (field.kind) {
      case 'string': {
        out[field.camel] = String(unwrap(rawVal));
        break;
      }
      case 'number': {
        const raw = unwrap(rawVal);
        if (typeof raw === 'number') {
          out[field.camel] = raw;
        } else {
          const n = Number(raw);
          if (!Number.isNaN(n)) out[field.camel] = n;
        }
        break;
      }
      case 'boolean': {
        if (typeof rawVal === 'boolean') {
          out[field.camel] = rawVal;
        } else if (rawVal === 'true' || rawVal === '1') {
          out[field.camel] = true;
        } else if (rawVal === 'false' || rawVal === '0') {
          out[field.camel] = false;
        } else {
          out[field.camel] = Boolean(rawVal);
        }
        break;
      }
      case 'enum': {
        const s = String(rawVal);
        if ((field.allowed as readonly string[]).includes(s)) {
          out[field.camel] = s;
        }
        break;
      }
      case 'enum[]': {
        const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
        out[field.camel] = arr
          .map(v => String(v))
          .filter(s => (field.allowed as readonly string[]).includes(s));
        break;
      }
      case 'object': {
        if (typeof rawVal === 'object' && rawVal !== null) {
          out[field.camel] = normalizeFields(rawVal as Record<string, unknown>, field.schema);
        }
        break;
      }
      case 'array': {
        const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
        out[field.camel] = arr.map(item =>
          normalizeFields(
            typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {},
            field.schema
          )
        );
        break;
      }
    }
  }
  return out;
}
