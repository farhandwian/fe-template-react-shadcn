/* eslint-disable @typescript-eslint/no-explicit-any */
import { AiConfigurationService } from "@/services/ai-configuration";
import { DictionaryItem } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, ColumnSort, PaginationState, Row } from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import AddDictionaryDialog from "./ai-configuration/add-dictionary-dialog";
import DictionaryDetailsDialog from "./ai-configuration/dictionary-details-dialog";
import EditDictionaryDialog from "./ai-configuration/edit-dictionary-dialog";
import ConfirmationDialog from "./confirmation-dialog";
import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import InformationDialog from "./information-dialog";
import { Button } from "./ui/button";
import EditIcon from "/src/assets/edit-icon.svg";
import EyeIcon from "/src/assets/eye-show.svg";
import DeleteIcon from "/src/assets/delete.svg";
import { AxiosError } from "axios";

const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

const DictionaryAITable: React.FC = () => {

  const queryClient = useQueryClient();

  
  const [filter, setFilter] = useState("");
  const [pagination, setPagination] =
    useState<PaginationState>(DEFAULT_PAGINATION);
  const debouncedFilter = useDebounce(filter, 500);
  const [sorting, setSorting] = useState<ColumnSort>({
    id: "key",
    desc: false,
  });

  const {
    data: dictionariesData, isLoading,error
  } = useQuery({
    queryKey: ["dictionaries", debouncedFilter, pagination, sorting],
    queryFn: () =>
      AiConfigurationService.getDictionaries({
        keyword: debouncedFilter,
        size: pagination.pageSize,
        page: pagination.pageIndex + 1,
        sort_by: sorting.id,
        sort_order: sorting.desc ? "desc" : "asc",
      }),
  });

  const axiosError = error as AxiosError;
  const dictionaries = dictionariesData?.data?.assets || [];
  const total = dictionariesData?.data?.metadata?.pagination?.total_items || 0;

  const handleSearch = (query: string) => setFilter(query || "");


  const transformedData: DictionaryItem[] = dictionariesData
  ? Object.entries(dictionaries).map(([key, value]) => ({
      key,
      value: value as string,
    }))
  : [];

  const handleViewDetails = (key: string) => {
    const selectedItem = transformedData.find(item => item.key === key);
    if (selectedItem) {
      setSelectedKey(selectedItem.key); 
      setSelectedValue(selectedItem.value as string);
      setDetailsDialogOpen(true); 
    }
  };
  
  const handleEdit = (key: string) => {
    const selectedItem = transformedData.find(item => item.key === key);
    if (selectedItem) {
      setSelectedKey(selectedItem.key);
      setSelectedValue(selectedItem.value as string);
      setEditDialogOpen(true);
    }
  };
  
    const handleDelete = (key: string) => {
      setKeyToDelete(key);
      setConfirmationDialogOpen(true);
    };

    const ActionCell = ({ row }: { row: Row<{ key: string; value: unknown }> }) => {
      const itemKey = row.original.key;
  
      return (
        <div className="flex flex-row gap-3">
          <Button size="icon" onClick={() => handleViewDetails(itemKey)}>
            <img src={EyeIcon} />
          </Button>
          <Button variant="access" size="icon" onClick={() => handleEdit(itemKey)}>
            <img src={EditIcon} />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDelete(itemKey)}
          >
            <img src={DeleteIcon} />
          </Button>
        </div>
      );
    };
  
    const columns: ColumnDef<{ key: string; value: string }>[] = [
      {
        accessorKey: "key",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Judul" />
        ),
        meta: {
          width: "25%",
        },
      },
      {
        accessorKey: "value",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Deskripsi" />
        ),
        meta: {
          width: "65%",
        },
      },
      {
        accessorKey: "actions",
        header: "Aksi",
        cell: (props) => <ActionCell {...props} />,
        meta: {
          width: "10%",
          minWidth: "100px",
        },
      },
    ];

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [selectedKey, setSelectedKey] = useState(""); 
  const [selectedValue, setSelectedValue] = useState(""); 
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);


  const handleRemove = async () => {
    if (keyToDelete) {
      try {
        await AiConfigurationService.deleteDictionaryByKey({ key: keyToDelete}); 
        queryClient.invalidateQueries({ queryKey: ["dictionaries"] }); 
        setConfirmationDialogOpen(false); 
        setDialogTitle("Kamus Berhasil Dihapus"); 
        setDialogDescription(`Kamus dengan judul ${keyToDelete} berhasil dihapus.`); 
        
        setInfoDialogOpen(true);
      } catch (error) {
        console.error("Error deleting dictionary:", error);
      } finally {
        setKeyToDelete(null); 
      }
    }
  };
  


  return (
    <>
      <DataTable
        data={transformedData || []}
        columns={columns}
        extra={<AddDictionaryDialog />}
        isLoading={isLoading}
        totalCount={total}
        searchKey="key"
        onSearch={handleSearch}
        errorCode={axiosError?.response?.status}
        onPaginationChange={setPagination}
        pagination={pagination}
        sorting={sorting}
        onSortingChange={(value) => {
          if (value.length > 0) {
            setSorting(value[0]);
          }
        }}
      />

      <ConfirmationDialog
        title="Hapus Kamus?"
        description={`Apakah anda yakin ingin menghapus ${keyToDelete}?`}
        buttonText="Batal"
        isOpen={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        submitButtonText="Hapus"
        onSubmit={handleRemove}
        className="w-96"
        buttonFullWidth
      />

      <EditDictionaryDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        selectedKey={selectedKey}
        selectedValue={selectedValue}
      />

      <DictionaryDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        title={selectedKey}
        description={selectedValue}
      />

      <InformationDialog
        illustrationType="success"
        isOpen={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        title={dialogTitle}
        description={dialogDescription}
        buttonText="Selesai"
      />
    </>
  );
};

export default DictionaryAITable;
