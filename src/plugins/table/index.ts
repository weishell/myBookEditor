import { BlockElementType } from '@/enums';
import { Table } from './Table';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { withTable } from './withTable';

export { Table, TableRow, TableCell, withTable };

export const tablePlugin = {
  name: 'table',
  blocks: [
    {
      type: BlockElementType.TABLE,
      component: Table,
    },
    {
      type: BlockElementType.TABLE_ROW,
      component: TableRow,
    },
    {
      type: BlockElementType.TABLE_CELL,
      component: TableCell,
    },
  ],
  extensions: [withTable],
};
