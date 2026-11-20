import { BlockElementType } from '@/enums';
import { Table } from './Table';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { withTable } from './withTable';
import { withTableStructure } from './withTableStructure';
import { TableContextMenu } from './TableContextMenu';

// withTableStructure 是真正挂在编辑器链上的那个（表格结构自愈）；
// withTable 里的 insertBreak 有已知缺陷，暂未接入，详见 ./withTable.ts 文件头。
export { Table, TableRow, TableCell, withTable, withTableStructure, TableContextMenu };

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
