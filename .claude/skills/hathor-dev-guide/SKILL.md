---
name: hathor-dev-guide
description: Guide for adding new data table pages, customizing themes/icons, and extending MUI theme TypeScript definitions in Hathor. Use when building new entity views, modifying theming, or working with the Generic Data View architecture.
---

## Architecture Overview

Hathor uses a **Generic Data View Pattern**: a reusable data table system where each entity page is assembled from a `ViewConfig` object passed to `GenericDataViewPage`.

Key files:
- `src/types/viewConfigTypes.ts` — ViewConfig type definitions
- `src/pages/GenericDataViewPage.tsx` — reusable data table page
- `src/components/search/SearchContext.tsx` — global search state
- `src/contexts/EditingContext.tsx` — sidebar editor state
- `src/hooks/useDataViewTableLogic.ts` — shared table logic (sort, filter, paginate)
- `src/components/data/DataPageContent.tsx` — table content renderer
- `src/components/data/dataTableTypes.ts` — ColumnDefinition types
- `src/components/search/searchTypes.ts` — FilterDefinition, SearchResultItem types

Existing examples to reference:
- `src/data/vehicle-types/` — production entity (VehicleType)
- `src/data/products/` — demo/example entity
- `src/data/stop-places/` — another example entity

---

## Adding a New Data Table Page

Follow these 8 steps. Create all files under `src/data/<your-feature>/`.

### Step 1: Define Data Types

Create `<feature>Types.ts` with:
1. An interface for the main data object (must have `id: string` and `version: number`)
2. A type for sortable column keys

```typescript
export interface Product {
  id: string;
  version: number;
  name: string;
  price: number;
  stock: number;
  category: 'Electronics' | 'Books' | 'Clothing';
}

export type ProductSortKey = 'name' | 'price' | 'stock';
```

### Step 2: Create Data Fetching Hook

Create `use<Feature>.ts`. Must return:
- `allData` — sorted array of entities
- `totalCount` — total number
- `loading` — boolean
- `error` — error or null
- `order` / `orderBy` — current sort state
- `handleRequestSort` — sort handler
- `page` / `rowsPerPage` / `setPage` / `setRowsPerPage` — pagination

For GraphQL data, follow the pattern in `src/data/vehicle-types/useVehicleTypes.ts`. For mock data, use local state with `useMemo` sorting.

### Step 3: Create Editor Component

Create `<Feature>Editor.tsx`. Must accept `itemId: string` prop. Uses `useEditing()` from `src/contexts/EditingContext.tsx` to close itself.

```typescript
interface ProductEditorProps {
  itemId: string;
}
```

### Step 4: Create Cell Components

Create a `cells/` subdirectory for custom renderers:
- Simple text: inline in config via `renderCell: item => item.name`
- Formatted values: dedicated component (e.g., `PriceCell.tsx`)
- Actions: `EditActionCell.tsx` — links row to EditingContext + sidebar editor

The EditActionCell must call `setEditingItem({ id: item.id, EditorComponent: YourEditor })`.

### Step 5: Create Search Hook

Create `use<Feature>Search.ts`. Registers a search function with the global SearchContext:
- Use `useSearch()` from `src/components/search`
- Call `registerSearchFunction('data', searchFn)` in a `useEffect`
- Return `SearchResultItem[]` from the search function
- Clean up by registering `null` on unmount

### Step 6: Assemble ViewConfig

Create `<feature>ViewConfig.tsx`. Export a config object with:

```typescript
export const productViewConfig = {
  useData: useProducts,
  useSearchRegistration: useProductSearch,
  useTableLogic: useDataViewTableLogic,
  PageContentComponent: DataPageContent,
  columns: productColumns,           // ColumnDefinition[]
  getFilterKey: getProductFilterKey,  // (item) => string
  getSortValue: getProductSortValue,  // (item, key) => string | number
  filters: productFilters,           // FilterDefinition[]
};
```

Column definition shape:
```typescript
{
  id: string;
  headerLabel: string;
  isSortable?: boolean;
  align?: 'left' | 'center' | 'right';
  renderCell: (item: T) => ReactNode;
  display: 'always' | 'desktop-only';
}
```

### Step 7: Create Page Component

Create `<Feature>View.tsx`:

```typescript
import { featureViewConfig } from './featureViewConfig.tsx';
import GenericDataViewPage from '../../pages/GenericDataViewPage.tsx';
import type { Feature, FeatureSortKey } from './featureTypes.ts';

export default function FeatureView() {
  return <GenericDataViewPage<Feature, FeatureSortKey> viewConfig={featureViewConfig} />;
}
```

### Step 8: Add Route and Menu Link

- Add route in `src/App.tsx` inside the protected routes
- Add navigation link in the menu component

---

## Theming

### Custom Theme Setup

- `public/default-theme-config.json` — default theme
- `public/custom-theme-config.json` — custom overrides
- Toggle: **Enable Custom Theme & Icons** in settings dialog
- `CustomizationContext.tsx` manages the `useCustomFeatures` state
- `src/utils/createThemeFromConfig.ts` converts JSON to MUI theme

Theme JSON supports all MUI ThemeOptions plus custom fields: `applicationName`, `companyName`, `logoUrl`, `logoHeight`.

### Custom Icons

Icon resolution via `src/data/iconLoaderUtils.ts` → `getIconUrl(name)`:
1. If custom features enabled: `public/static/customIcons/[name].svg|png`
2. Fallback: `public/static/defaultIcons/[name].svg|png`
3. Final fallback: `default.svg|png` in defaultIcons

### Extending Theme TypeScript

Add custom properties in `src/types/theme-config.d.ts`:
- Extend `ThemeConfig` interface
- Add module augmentation for `@mui/material/styles` (`Theme` and `ThemeOptions`)
- Properties are then available via `useTheme()` in components
