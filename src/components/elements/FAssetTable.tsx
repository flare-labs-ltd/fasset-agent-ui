import {
    Table,
    Text,
    rem,
    Pagination,
    Loader
} from "@mantine/core";
import {
    IconArrowsMoveVertical,
    IconArrowUp
} from "@tabler/icons-react";
import React, {
    useCallback,
    useState,
    memo,
    useMemo,
    ReactNode,
    CSSProperties
} from "react";
import { useTranslation } from "react-i18next";
import { orderBy } from "lodash-es";
import classes from "@/styles/components/elements/FAssetTable.module.scss";
import { isBoolean, isNumeric } from "@/utils";

export interface IFAssetColumn {
    id: string;
    label: string|ReactNode;
    sorted?: boolean;
    render?: (item: any) => React.ReactNode;
    className?: string;
    headerClassName?: string;
    colClass?: string;
    sortColumns?: { field: string, direction: 'asc' | 'desc' }[]
}
interface IFAssetTable {
    items: any[];
    columns: IFAssetColumn[];
    loading?: boolean;
    className?: string;
    style?: CSSProperties;
    emptyLabel?: string;
    pagination?: boolean;
    perPage?: number;
    scrollContainerWidth?: number;
}

interface ISortStatus {
    column: string | undefined;
    direction: string | undefined;
    field: string | undefined;
}

const PER_PAGE = 10;

const FAssetTable = memo(({ items, columns, loading, className, style, emptyLabel, pagination, scrollContainerWidth, perPage }: IFAssetTable) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortStatus, setSortStatus] = useState<ISortStatus>({
        column: undefined,
        direction: undefined,
        field: undefined
    });
    const { t } = useTranslation();

    const sortFunc = (item: any, fieldId: string) => {
        let field = item[fieldId];
        if (field === null || undefined) {
            return null;
        }
        if (typeof item[fieldId] === 'number') {
            field = item[fieldId];
        } else if (isNumeric(item[fieldId])) {
            field = Number(item[fieldId].replace(/\D/g, ''));
        } else if (isBoolean(item[fieldId])) {
            field = item[fieldId];
        } else {
            field = (item[fieldId] as any).toLowerCase();
        }
        return field;
    }

    const onSort = (column: IFAssetColumn) => {
        if (!column.sorted) return;

        let direction: 'asc' | 'desc' = 'asc';
        let field: string = column.id;

        if (sortStatus?.column === column.id) {
            direction = sortStatus.direction === 'asc' ? 'desc' : 'asc';
        }

        if (column.sortColumns) {
            const currentIndex = column.sortColumns.findIndex(m => m.direction === sortStatus.direction && sortStatus.field === m.field);
            const nextIndex = (currentIndex + 1) % column.sortColumns.length;
            const nextsortColumns = column.sortColumns[nextIndex];
            direction = nextsortColumns.direction;
            field = nextsortColumns.field
        }

        setSortStatus({
            column: column.id,
            direction: direction,
            field: field
        });
    }

    const chunk = useCallback(<T extends any>(array: T[], size: number): T[][] => {
        if (!array.length) {
            return [];
        }
        const head = array.slice(0, size);
        const tail = array.slice(size);
        return [head, ...chunk(tail, size)];
    }, []);

    const localItems = useMemo(() => {
        let localItems = [...items];

        if (sortStatus.column) {
            const column = columns.find(column => column.id === sortStatus.column);
            if (column) {
                localItems = orderBy(
                    items,
                    [(item: any) => sortFunc(item, sortStatus.field || column.id)],
                    [sortStatus.direction === 'asc' ? 'asc' : 'desc']
                );
            }
        }

        if (pagination) {
            const paginatedRows = chunk(localItems, perPage ?? PER_PAGE);
            if (paginatedRows.length > 0) {
                setTotalPages(paginatedRows.length);
                localItems = paginatedRows[currentPage - 1];
            }
        }

        return localItems;
    }, [items, sortStatus, pagination, currentPage]);

    const renderRows = useCallback(() => {
        return localItems?.map((item, index) => (
            <Table.Tr key={index}>
                {columns.map(column => (
                    <Table.Td
                        key={column.id}
                        className={`${column.className ?? ''}`}
                    >
                        <div className={(column.colClass ? column.colClass : '') + ' '}>
                            {column.render !== undefined
                                ? column.render(item)
                                : item[column.id]
                            }
                        </div>
                    </Table.Td>
                ))}
            </Table.Tr>
        ));
    }, [localItems]);

    return (
        <>
            <div className={className} style={style}>
                <Component
                    scrollContainerWidth={scrollContainerWidth}
                >
                    <Table verticalSpacing="md">
                        <Table.Thead className="text-xs">
                            <Table.Tr>
                                {columns.map(column => (
                                    <Table.Th
                                        key={column.id}
                                        className={`text-xs text-[var(--flr-gray)] uppercase ${column.sorted ? 'cursor-pointer' : ''} ${column.className ?? ''} ${column.headerClassName || ''}`}
                                        onClick={() => onSort(column)}
                                    >
                                        <div className={(column.colClass ? column.colClass : '') + ' ' + 'flex'}>
                                            {!React.isValidElement(column.label) &&
                                                <Text size="sm">{column.label}</Text>
                                            }
                                            {React.isValidElement(column.label) &&
                                                <div>{column.label}</div>
                                            }
                                            {sortStatus.column === column.id &&
                                                <IconArrowUp
                                                    style={{width: rem(15), height: rem(15)}}
                                                    className={`${classes.sortIcon} ${sortStatus.direction === 'desc' ? classes.isReversed : ''} ml-1 flex-shrink-0`}
                                                />
                                            }
                                            {sortStatus.column !== column.id && column.sorted &&
                                                <IconArrowsMoveVertical
                                                    style={{width: rem(15), height: rem(15)}}
                                                    className="ml-1 flex-shrink-0"
                                                />
                                            }
                                        </div>
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading &&
                                <Table.Tr>
                                    <Table.Td
                                        colSpan={13}
                                    >
                                        <Loader className="flex mx-auto mt-2"/>
                                    </Table.Td>
                                </Table.Tr>
                            }
                            {localItems.length === 0 && !loading &&
                                <Table.Tr>
                                    <Table.Td colSpan={13} className="text-center">
                                        <Text>{emptyLabel ?? t('fasset_table.empty_label')}</Text>
                                    </Table.Td>
                                </Table.Tr>
                            }
                            {!loading && renderRows()}
                        </Table.Tbody>
                    </Table>
                </Component>
            </div>
            {pagination && localItems.length > 0 &&
                <div className="flex text-xs justify-end">
                    <Pagination
                        total={totalPages}
                        value={currentPage}
                        onChange={setCurrentPage}
                        size="xs"
                        className="mt-4"
                    />
                </div>
            }
        </>
    );
});

FAssetTable.displayName = 'FAssetTable';

export default FAssetTable;

function Component({children, scrollContainerWidth}: {
    children: React.ReactNode,
    scrollContainerWidth: number | undefined
}) {
    return scrollContainerWidth !== undefined
        ? <Table.ScrollContainer minWidth={scrollContainerWidth}>{children}</Table.ScrollContainer>
        : <div>{children}</div>
}
