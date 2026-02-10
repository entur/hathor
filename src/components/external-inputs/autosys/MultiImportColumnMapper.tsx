import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { TableMeta } from '../../../data/vehicle-imports/inputTextAnalyzer';

const NONE = '__none__';
const PREVIEW_ROWS = 5;

export interface ColumnMapping {
  regNumberCol: string;
  operationalRefCol: string | null;
}

interface MultiImportColumnMapperProps {
  tableMeta: TableMeta;
  onConfirm: (mapping: ColumnMapping) => void;
}

export default function MultiImportColumnMapper({
  tableMeta,
  onConfirm,
}: MultiImportColumnMapperProps) {
  const { t } = useTranslation();
  const { headers, rows } = tableMeta;

  const [regNumberCol, setRegNumberCol] = useState(headers[0] ?? '');
  const [operationalRefCol, setOperationalRefCol] = useState<string>(NONE);

  // Push initial mapping to parent on mount
  useEffect(() => {
    onConfirm({
      regNumberCol: headers[0] ?? '',
      operationalRefCol: null,
    });
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegNumberColChange = (value: string) => {
    setRegNumberCol(value);
    onConfirm({
      regNumberCol: value,
      operationalRefCol: operationalRefCol === NONE ? null : operationalRefCol,
    });
  };

  const handleOperationalRefColChange = (value: string) => {
    setOperationalRefCol(value);
    onConfirm({ regNumberCol, operationalRefCol: value === NONE ? null : value });
  };

  const previewRows = rows.slice(0, PREVIEW_ROWS);
  const highlightCols = new Set([
    regNumberCol,
    ...(operationalRefCol !== NONE ? [operationalRefCol] : []),
  ]);

  return (
    <>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {t(
          'import.multi.columnMapperDescription',
          'We detected {{count}} columns in your file. Map the columns to the correct fields.',
          { count: headers.length }
        )}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>{t('import.multi.regNumberColumn', 'Registration number')}</InputLabel>
          <Select
            value={regNumberCol}
            label={t('import.multi.regNumberColumn', 'Registration number')}
            onChange={e => handleRegNumberColChange(e.target.value)}
            data-testid="column-mapper-reg-number"
          >
            {headers.map(h => (
              <MenuItem key={h} value={h}>
                {h}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>
            {t('import.multi.operationalRefColumn', 'Operational ID (optional)')}
          </InputLabel>
          <Select
            value={operationalRefCol}
            label={t('import.multi.operationalRefColumn', 'Operational ID (optional)')}
            onChange={e => handleOperationalRefColChange(e.target.value)}
            data-testid="column-mapper-operational-ref"
          >
            <MenuItem value={NONE}>
              <em>{t('import.multi.none', 'None')}</em>
            </MenuItem>
            {headers.map(h => (
              <MenuItem key={h} value={h}>
                {h}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t('import.multi.preview', 'Preview (first {{count}} rows)', { count: previewRows.length })}
      </Typography>

      <TableContainer
        sx={{ maxHeight: 240, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map(h => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: highlightCols.has(h) ? 'action.selected' : 'background.paper',
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {previewRows.map((row, i) => (
              <TableRow key={i}>
                {headers.map(h => (
                  <TableCell
                    key={h}
                    sx={{
                      bgcolor: highlightCols.has(h) ? 'action.hover' : 'transparent',
                    }}
                  >
                    {row[h] ?? ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {rows.length > PREVIEW_ROWS && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {t('import.multi.moreRows', '...and {{count}} more rows', {
            count: rows.length - PREVIEW_ROWS,
          })}
        </Typography>
      )}
    </>
  );
}
