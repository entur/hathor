import type {
  My_VehicleType,
  TextType,
  PrivateCodeStructure,
  PassengerCapacityStructure,
  VehicleManoeuvringRequirements_STUB,
  KeyValueStructure,
} from './generated/types.js';
import { TRANSPORT_MODES, PROPULSION_TYPES, FUEL_TYPES, FARE_CLASSES } from './generated/types.js';

function normalizeKeyValueStructure(src: Record<string, unknown>): Partial<KeyValueStructure> {
  const key = (() => {
    const rawVal = src['Key'] ?? src['key'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const value = (() => {
    const rawVal = src['Value'] ?? src['value'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const typeOfKey = (() => {
    const rawVal = src['TypeOfKey'] ?? src['typeOfKey'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();

  return {
    ...(key !== undefined ? { key } : {}),
    ...(value !== undefined ? { value } : {}),
    ...(typeOfKey !== undefined ? { typeOfKey } : {}),
  };
}

function normalizePrivateCodeStructure(
  src: Record<string, unknown>
): Partial<PrivateCodeStructure> {
  const value = (() => {
    const rawVal = src['Value'] ?? src['value'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const type = (() => {
    const rawVal = src['Type'] ?? src['type'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();

  return {
    ...(value !== undefined ? { value } : {}),
    ...(type !== undefined ? { type } : {}),
  };
}

function normalizeTextType(src: Record<string, unknown>): Partial<TextType> {
  const value = (() => {
    const rawVal = src['Value'] ?? src['value'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const lang = (() => {
    const rawVal = src['Lang'] ?? src['lang'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const textIdType = (() => {
    const rawVal = src['TextIdType'] ?? src['textIdType'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();

  return {
    ...(value !== undefined ? { value } : {}),
    ...(lang !== undefined ? { lang } : {}),
    ...(textIdType !== undefined ? { textIdType } : {}),
  };
}

function normalizePassengerCapacityStructure(
  src: Record<string, unknown>
): Partial<PassengerCapacityStructure> {
  const fareClass = (() => {
    const rawVal = src['FareClass'] ?? src['fareClass'];
    if (rawVal == null) return undefined;
    const s = String(rawVal);
    return (FARE_CLASSES as readonly string[]).includes(s)
      ? (s as (typeof FARE_CLASSES)[number])
      : undefined;
  })();
  const totalCapacity = (() => {
    const rawVal = src['TotalCapacity'] ?? src['totalCapacity'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();
  const seatingCapacity = (() => {
    const rawVal = src['SeatingCapacity'] ?? src['seatingCapacity'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();
  const standingCapacity = (() => {
    const rawVal = src['StandingCapacity'] ?? src['standingCapacity'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();
  const specialPlaceCapacity = (() => {
    const rawVal = src['SpecialPlaceCapacity'] ?? src['specialPlaceCapacity'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();
  const pushchairCapacity = (() => {
    const rawVal = src['PushchairCapacity'] ?? src['pushchairCapacity'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();
  const wheelchairPlaceCapacity = (() => {
    const rawVal = src['WheelchairPlaceCapacity'] ?? src['wheelchairPlaceCapacity'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();
  const pramPlaceCapacity = (() => {
    const rawVal = src['PramPlaceCapacity'] ?? src['pramPlaceCapacity'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();
  const bicycleRackCapacity = (() => {
    const rawVal = src['BicycleRackCapacity'] ?? src['bicycleRackCapacity'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();

  return {
    ...(fareClass !== undefined ? { fareClass } : {}),
    ...(totalCapacity !== undefined ? { totalCapacity } : {}),
    ...(seatingCapacity !== undefined ? { seatingCapacity } : {}),
    ...(standingCapacity !== undefined ? { standingCapacity } : {}),
    ...(specialPlaceCapacity !== undefined ? { specialPlaceCapacity } : {}),
    ...(pushchairCapacity !== undefined ? { pushchairCapacity } : {}),
    ...(wheelchairPlaceCapacity !== undefined ? { wheelchairPlaceCapacity } : {}),
    ...(pramPlaceCapacity !== undefined ? { pramPlaceCapacity } : {}),
    ...(bicycleRackCapacity !== undefined ? { bicycleRackCapacity } : {}),
  };
}

function normalizeVehicleManoeuvringRequirements_STUB(
  src: Record<string, unknown>
): Partial<VehicleManoeuvringRequirements_STUB> {
  const reversible = (() => {
    const rawVal = src['Reversible'] ?? src['reversible'];
    if (rawVal == null) return undefined;
    if (typeof rawVal === 'boolean') return rawVal;
    if (rawVal === 'true' || rawVal === '1') return true;
    if (rawVal === 'false' || rawVal === '0') return false;
    return Boolean(rawVal);
  })();
  const minimumTurningCircle = (() => {
    const rawVal = src['MinimumTurningCircle'] ?? src['minimumTurningCircle'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();
  const minimumOvertakingWidth = (() => {
    const rawVal = src['MinimumOvertakingWidth'] ?? src['minimumOvertakingWidth'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();
  const minimumLength = (() => {
    const rawVal = src['MinimumLength'] ?? src['minimumLength'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw === 'number') return raw;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })();

  return {
    ...(reversible !== undefined ? { reversible } : {}),
    ...(minimumTurningCircle !== undefined ? { minimumTurningCircle } : {}),
    ...(minimumOvertakingWidth !== undefined ? { minimumOvertakingWidth } : {}),
    ...(minimumLength !== undefined ? { minimumLength } : {}),
  };
}

/**
 * Normalize parsed XML (PascalCase keys, possible {value} wrappers)
 * or a plain object into a clean My_VehicleType.
 */
export function normalize(src: Record<string, unknown>): Partial<My_VehicleType> {
  const name = (() => {
    const rawVal = src['Name'] ?? src['name'];
    if (rawVal == null) return undefined;
    const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
    return arr.map(item =>
      normalizeTextType(
        typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {}
      )
    );
  })();
  const shortName = (() => {
    const rawVal = src['ShortName'] ?? src['shortName'];
    if (rawVal == null) return undefined;
    const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
    return arr.map(item =>
      normalizeTextType(
        typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {}
      )
    );
  })();
  const description = (() => {
    const rawVal = src['Description'] ?? src['description'];
    if (rawVal == null) return undefined;
    const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
    return arr.map(item =>
      normalizeTextType(
        typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {}
      )
    );
  })();
  const privateCode = (() => {
    const rawVal = src['PrivateCode'] ?? src['privateCode'];
    if (rawVal == null) return undefined;
    return typeof rawVal === 'object' && rawVal !== null
      ? normalizePrivateCodeStructure(rawVal as Record<string, unknown>)
      : undefined;
  })();
  const transportMode = (() => {
    const rawVal = src['TransportMode'] ?? src['transportMode'];
    if (rawVal == null) return undefined;
    const s = String(rawVal);
    return (TRANSPORT_MODES as readonly string[]).includes(s)
      ? (s as (typeof TRANSPORT_MODES)[number])
      : undefined;
  })();
  const deckPlanRef = (() => {
    const rawVal = src['DeckPlanRef'] ?? src['deckPlanRef'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const euroClass = (() => {
    const rawVal = src['EuroClass'] ?? src['euroClass'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const reversingDirection = (() => {
    const rawVal = src['ReversingDirection'] ?? src['reversingDirection'];
    if (rawVal == null) return undefined;
    if (typeof rawVal === 'boolean') return rawVal;
    if (rawVal === 'true' || rawVal === '1') return true;
    if (rawVal === 'false' || rawVal === '0') return false;
    return Boolean(rawVal);
  })();
  const selfPropelled = (() => {
    const rawVal = src['SelfPropelled'] ?? src['selfPropelled'];
    if (rawVal == null) return undefined;
    if (typeof rawVal === 'boolean') return rawVal;
    if (rawVal === 'true' || rawVal === '1') return true;
    if (rawVal === 'false' || rawVal === '0') return false;
    return Boolean(rawVal);
  })();
  const propulsionTypes = (() => {
    const rawVal = src['PropulsionTypes'] ?? src['propulsionTypes'];
    if (rawVal == null) return undefined;
    const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
    return arr
      .map(v => String(v))
      .filter(s =>
        (PROPULSION_TYPES as readonly string[]).includes(s)
      ) as (typeof PROPULSION_TYPES)[number][];
  })();
  const propulsionType = (() => {
    const rawVal = src['PropulsionType'] ?? src['propulsionType'];
    if (rawVal == null) return undefined;
    const s = String(rawVal);
    return (PROPULSION_TYPES as readonly string[]).includes(s)
      ? (s as (typeof PROPULSION_TYPES)[number])
      : undefined;
  })();
  const fuelTypes = (() => {
    const rawVal = src['FuelTypes'] ?? src['fuelTypes'];
    if (rawVal == null) return undefined;
    const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
    return arr
      .map(v => String(v))
      .filter(s => (FUEL_TYPES as readonly string[]).includes(s)) as (typeof FUEL_TYPES)[number][];
  })();
  const maximumRange = (() => {
    const rawVal = src['MaximumRange'] ?? src['maximumRange'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const maximumVelocity = (() => {
    const rawVal = src['MaximumVelocity'] ?? src['maximumVelocity'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const passengerCapacity = (() => {
    const rawVal = src['PassengerCapacity'] ?? src['passengerCapacity'];
    if (rawVal == null) return undefined;
    return typeof rawVal === 'object' && rawVal !== null
      ? normalizePassengerCapacityStructure(rawVal as Record<string, unknown>)
      : undefined;
  })();
  const id = (() => {
    const rawVal = src['Id'] ?? src['id'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const includedIn = (() => {
    const rawVal = src['IncludedIn'] ?? src['includedIn'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const classifiedAsRef = (() => {
    const rawVal = src['ClassifiedAsRef'] ?? src['classifiedAsRef'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const facilities = (() => {
    const rawVal = src['Facilities'] ?? src['facilities'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const monitored = (() => {
    const rawVal = src['Monitored'] ?? src['monitored'];
    if (rawVal == null) return undefined;
    if (typeof rawVal === 'boolean') return rawVal;
    if (rawVal === 'true' || rawVal === '1') return true;
    if (rawVal === 'false' || rawVal === '0') return false;
    return Boolean(rawVal);
  })();
  const lowFloor = (() => {
    const rawVal = src['LowFloor'] ?? src['lowFloor'];
    if (rawVal == null) return undefined;
    if (typeof rawVal === 'boolean') return rawVal;
    if (rawVal === 'true' || rawVal === '1') return true;
    if (rawVal === 'false' || rawVal === '0') return false;
    return Boolean(rawVal);
  })();
  const hasLiftOrRamp = (() => {
    const rawVal = src['HasLiftOrRamp'] ?? src['hasLiftOrRamp'];
    if (rawVal == null) return undefined;
    if (typeof rawVal === 'boolean') return rawVal;
    if (rawVal === 'true' || rawVal === '1') return true;
    if (rawVal === 'false' || rawVal === '0') return false;
    return Boolean(rawVal);
  })();
  const hasHoist = (() => {
    const rawVal = src['HasHoist'] ?? src['hasHoist'];
    if (rawVal == null) return undefined;
    if (typeof rawVal === 'boolean') return rawVal;
    if (rawVal === 'true' || rawVal === '1') return true;
    if (rawVal === 'false' || rawVal === '0') return false;
    return Boolean(rawVal);
  })();
  const hoistOperatingRadius = (() => {
    const rawVal = src['HoistOperatingRadius'] ?? src['hoistOperatingRadius'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const boardingHeight = (() => {
    const rawVal = src['BoardingHeight'] ?? src['boardingHeight'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const gapToPlatform = (() => {
    const rawVal = src['GapToPlatform'] ?? src['gapToPlatform'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const length = (() => {
    const rawVal = src['Length'] ?? src['length'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const width = (() => {
    const rawVal = src['Width'] ?? src['width'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const height = (() => {
    const rawVal = src['Height'] ?? src['height'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const weight = (() => {
    const rawVal = src['Weight'] ?? src['weight'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const firstAxleHeight = (() => {
    const rawVal = src['FirstAxleHeight'] ?? src['firstAxleHeight'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    if (typeof raw !== 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) return n;
    }
    return raw as number;
  })();
  const canCarry = (() => {
    const rawVal = src['CanCarry'] ?? src['canCarry'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const canManoeuvre = (() => {
    const rawVal = src['CanManoeuvre'] ?? src['canManoeuvre'];
    if (rawVal == null) return undefined;
    return typeof rawVal === 'object' && rawVal !== null
      ? normalizeVehicleManoeuvringRequirements_STUB(rawVal as Record<string, unknown>)
      : undefined;
  })();
  const satisfiesFacilityRequirements = (() => {
    const rawVal = src['SatisfiesFacilityRequirements'] ?? src['satisfiesFacilityRequirements'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const keyList = (() => {
    const rawVal = src['KeyList'] ?? src['keyList'];
    if (rawVal == null) return undefined;
    const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
    return arr.map(item =>
      normalizeKeyValueStructure(
        typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {}
      )
    );
  })();
  const privateCodes = (() => {
    const rawVal = src['PrivateCodes'] ?? src['privateCodes'];
    if (rawVal == null) return undefined;
    const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
    return arr.map(item =>
      normalizePrivateCodeStructure(
        typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {}
      )
    );
  })();
  const brandingRef = (() => {
    const rawVal = src['BrandingRef'] ?? src['brandingRef'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();
  const responsibilitySetRef = (() => {
    const rawVal = src['ResponsibilitySetRef'] ?? src['responsibilitySetRef'];
    if (rawVal == null) return undefined;
    const raw =
      typeof rawVal === 'object' &&
      rawVal !== null &&
      'value' in (rawVal as Record<string, unknown>)
        ? (rawVal as Record<string, unknown>).value
        : rawVal;
    return String(raw);
  })();

  return {
    ...(name !== undefined ? { name } : {}),
    ...(shortName !== undefined ? { shortName } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(privateCode !== undefined ? { privateCode } : {}),
    ...(transportMode !== undefined ? { transportMode } : {}),
    ...(deckPlanRef !== undefined ? { deckPlanRef } : {}),
    ...(euroClass !== undefined ? { euroClass } : {}),
    ...(reversingDirection !== undefined ? { reversingDirection } : {}),
    ...(selfPropelled !== undefined ? { selfPropelled } : {}),
    ...(propulsionTypes !== undefined ? { propulsionTypes } : {}),
    ...(propulsionType !== undefined ? { propulsionType } : {}),
    ...(fuelTypes !== undefined ? { fuelTypes } : {}),
    ...(maximumRange !== undefined ? { maximumRange } : {}),
    ...(maximumVelocity !== undefined ? { maximumVelocity } : {}),
    ...(passengerCapacity !== undefined ? { passengerCapacity } : {}),
    ...(id !== undefined ? { id } : {}),
    ...(includedIn !== undefined ? { includedIn } : {}),
    ...(classifiedAsRef !== undefined ? { classifiedAsRef } : {}),
    ...(facilities !== undefined ? { facilities } : {}),
    ...(monitored !== undefined ? { monitored } : {}),
    ...(lowFloor !== undefined ? { lowFloor } : {}),
    ...(hasLiftOrRamp !== undefined ? { hasLiftOrRamp } : {}),
    ...(hasHoist !== undefined ? { hasHoist } : {}),
    ...(hoistOperatingRadius !== undefined ? { hoistOperatingRadius } : {}),
    ...(boardingHeight !== undefined ? { boardingHeight } : {}),
    ...(gapToPlatform !== undefined ? { gapToPlatform } : {}),
    ...(length !== undefined ? { length } : {}),
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(weight !== undefined ? { weight } : {}),
    ...(firstAxleHeight !== undefined ? { firstAxleHeight } : {}),
    ...(canCarry !== undefined ? { canCarry } : {}),
    ...(canManoeuvre !== undefined ? { canManoeuvre } : {}),
    ...(satisfiesFacilityRequirements !== undefined ? { satisfiesFacilityRequirements } : {}),
    ...(keyList !== undefined ? { keyList } : {}),
    ...(privateCodes !== undefined ? { privateCodes } : {}),
    ...(brandingRef !== undefined ? { brandingRef } : {}),
    ...(responsibilitySetRef !== undefined ? { responsibilitySetRef } : {}),
  };
}
