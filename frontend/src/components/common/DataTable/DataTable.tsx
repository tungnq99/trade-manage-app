import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DataTableProps } from './DataTable.types';

export function DataTable<T extends { id?: string; _id?: string }>({
    data,
    columns,
    loading = false,
    emptyMessage = 'No data available',
    onRowClick,
}: DataTableProps<T>) {
    // Loading skeleton
    if (loading) {
        return (
            <div className="rounded-md border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, idx) => (
                                <TableHead key={idx}>{col.header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, idx) => (
                            <TableRow key={idx}>
                                {columns.map((_, colIdx) => (
                                    <TableCell key={colIdx}>
                                        <div className="h-4 bg-muted animate-pulse rounded" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    // Empty state
    if (!data || data.length === 0) {
        return (
            <div className="rounded-md border border-border p-12 text-center">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col, idx) => (
                            <TableHead key={idx}>{col.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => {
                        const rowKey = item._id || item.id || Math.random().toString();
                        return (
                            <TableRow
                                key={rowKey}
                                onClick={() => onRowClick?.(item)}
                                className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                            >
                                {columns.map((col, colIdx) => (
                                    <TableCell key={colIdx}>
                                        {col.cell
                                            ? col.cell(item)
                                            : col.accessorKey
                                                ? String(item[col.accessorKey] ?? '')
                                                : ''}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
