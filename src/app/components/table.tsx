"use client";

import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import PlusIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import useConstituents from '@/app/hooks/useConstituentsData';
import { Constituent } from '@prisma/client';

type ConstituentApiResponse = {
  data: Array<Constituent>;
  meta: {
    totalRowCount: number;
  };
};

type Constituent = {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Table() {

  const { getConstituents, createConstituent, updateConstituent, deleteConstituent, downloadCSV } = useConstituents();
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<ConstituentApiResponse>({
    queryKey: [
      'constituents',
      {
        columnFilters, //refetch when columnFilters changes
        globalFilter, //refetch when globalFilter changes
        pagination, //refetch when pagination changes
        sorting, //refetch when sorting changes
      },
    ],
    queryFn: async () => {
      const json = await getConstituents({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        columnFilters,
        globalFilter,
        sorting,
      });

      return json;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const columns = useMemo<MRT_ColumnDef<Constituent>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableEditing: false,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'zip',
        header: 'Zip',
      },
      {
        accessorKey: 'phone',
        header: 'Phone Number',
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        enableEditing: false,=
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        enableEditing: false,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onEditingRowSave: async ({ exitEditingMode, row, values }) => {

      await updateConstituent({ ...values });
      exitEditingMode();
      refetch();
    },
    onCreatingRowSave: async ({ exitCreatingMode, row, values }) => {
      const res = await createConstituent({ ...values });
      exitCreatingMode();
      refetch();
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Create New User">
          <IconButton
            onClick={() => {
              table.setCreatingRow(true);
            }}

          >
            <PlusIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Download CSV">
          <IconButton
            onClick={downloadCSV}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={async () => {
            await deleteConstituent(row.original.id);
            refetch();
          }}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    muiTablePaperProps: {
      elevation: 0,
    },
    muiTableHeadRowProps: {
      sx: {
        '& > th': {
          borderBottom: 'none',
        }
      }
    },
    enableRowActions: true,
    muiTableBodyRowProps: ({ row, staticRowIndex, table }) => ({
      sx: {
        '& > td': {
          borderBottom: 'none',
        },
      },
    }),
  });

  return <MaterialReactTable table={table}
  />;
};