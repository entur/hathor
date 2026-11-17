import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { TableMeta } from '../utils/inputTextAnalyzer';
import { FormSelectField } from '../../../components/FormFields.tsx';

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

  const columns = headers.map(h => ({ value: h, label: h }));
  const previewRows = rows.slice(0, PREVIEW_ROWS);
  const highlightCols = new Set([
    regNumberCol,
    ...(operationalRefCol !== NONE ? [operationalRefCol] : []),
  ]);

  return (
    <>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {t('import.multi.columnMapperDescription', { count: headers.length })}
      </Typography>

      {/* The form's Linje fields, at most two per row (FormSections, #283). */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { sm: '1fr 1fr' },
          columnGap: 2,
          rowGap: 3,
          mb: 3,
        }}
      >
        <FormSelectField
          id="column-mapper-reg-number"
          label={t('import.multi.regNumberColumn')}
          value={regNumberCol}
          options={columns}
          onChange={v => v && handleRegNumberColChange(v)}
        />
        <FormSelectField
          id="column-mapper-operational-ref"
          label={t('import.multi.operationalRefColumn')}
          value={operationalRefCol === NONE ? undefined : operationalRefCol}
          options={columns}
          noneLabel={t('import.multi.none')}
          onChange={v => handleOperationalRefColChange(v ?? NONE)}
        />
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t('import.multi.preview', { count: previewRows.length })}
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
                    fontWeight: 'fontWeightBold',
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
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
          {t('import.multi.moreRows', {
            count: rows.length - PREVIEW_ROWS,
          })}
        </Typography>
      )}
    </>
  );
}
