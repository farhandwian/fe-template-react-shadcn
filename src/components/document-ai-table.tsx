/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteDocument } from "@/actions/ai-config/document";
import { AiConfigurationService } from "@/services/ai-configuration";
import { DocumentItem } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, ColumnSort, PaginationState, Row } from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import AddDocumentDialog from "./ai-configuration/add-document-dialog";
import DocumentDetailsDialog from "./ai-configuration/document-details-dialog";
import EditDocumentDialog from "./ai-configuration/edit-document-dialog";
import ConfirmationDialog from "./confirmation-dialog";
import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import InformationDialog from "./information-dialog";
import { Button } from "./ui/button";
import DeleteIcon from "/src/assets/delete.svg";
import DocsIcon from "/src/assets/docs.svg";
import EditIcon from "/src/assets/edit-icon.svg";
import EyeIcon from "/src/assets/eye-show.svg";
import { AxiosError } from "axios";

const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

const DocumentAITable: React.FC = () => {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("");
  const [pagination, setPagination] =
    useState<PaginationState>(DEFAULT_PAGINATION);
  const debouncedFilter = useDebounce(filter, 500);
  const [sorting, setSorting] = useState<ColumnSort>({
    id: "name",
    desc: false,
  });

  const {
    data: documentsData, isLoading,error
  } = useQuery({
    queryKey: ["documents", debouncedFilter, pagination, sorting],
    queryFn: () =>
      AiConfigurationService.getDocuments({
        keyword: debouncedFilter,
        size: pagination.pageSize,
        page: pagination.pageIndex + 1,
        sort_by: sorting.id,
        sort_order: sorting.desc ? "desc" : "asc",
      }),
  });

  const axiosError = error as AxiosError;

  const documents = documentsData?.data?.assets || [];
  const total = documentsData?.data?.metadata?.pagination?.total_items || 0;

  const handleSearch = (query: string) => setFilter(query || "");

    const transformedData: DocumentItem[] = useMemo(() => {
      return Object.values(documents).map((document: any) => ({
        id: document.id,
        name: document.name,
        file_path: document.file_path,
      }));
    }, [documents]);

  const handleViewDetails = (id: string) => {
    const selectedItem = transformedData.find((item) => item.id === id);
    if (selectedItem) {
      setSelectedId(selectedItem.id);
      setSelectedName(selectedItem.name as string);
      setSelectedFilePath(selectedItem.file_path as string);
      setDetailsDialogOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    const selectedItem = transformedData.find((item) => item.id === id);
    if (selectedItem) {
      setSelectedId(selectedItem.id);
      setSelectedName(selectedItem.name as string);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setConfirmationDialogOpen(true);
  };

  const ActionCell = ({ row }: { row: Row<{ id: string; name: string }> }) => {
    const itemId = row.original.id;

    return (
      <div className="flex flex-row gap-3">
        <Button size="icon" onClick={() => handleViewDetails(itemId)}>
          <img src={EyeIcon} />
        </Button>
        <Button variant="access" size="icon" onClick={() => handleEdit(itemId)}>
          <img src={EditIcon} />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => handleDelete(itemId)}
        >
          <img src={DeleteIcon} />
        </Button>
      </div>
    );
  };

  const columns: ColumnDef<DocumentItem, any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
      meta: {
        width: "25%",
      },
    },
    {
      accessorKey: "file_path",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="File" />
      ),
      cell: ({ getValue }) => {
        const value = getValue();
        const fileName = (typeof value === 'string' ? value.split('/').pop() : "Lihat File") || "Lihat File";
        const identifier = fileName.split('-').slice(-1)[0].replace('.pdf', '');
        return (
          <a
            href={value as string}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            <div className="flex gap-2 items-center">
            <img src={DocsIcon} />
            {identifier}
            </div>
          </a>
        );
      },
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

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const handleRemove = async () => {
    if (idToDelete) {
      try {
        await deleteDocument(idToDelete);
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        setConfirmationDialogOpen(false);
        setDialogTitle("Berhasil!");
        setDialogDescription("Dokumen berhasil dihapus.");
        setInfoDialogOpen(true);
      } catch (error) {
        console.error("Error deleting document:", error);
      } finally {
        setIdToDelete(null);
      }
    }
  };

  return (
    <>
      <DataTable
        data={transformedData || []}
        columns={columns}
        extra={<AddDocumentDialog />}
        isLoading={isLoading}
        totalCount={total}
        searchKey="name"
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
        title="Hapus Dokumen?"
        description="Apakah anda yakin ingin menghapus data dokumen?"
        buttonText="Batal"
        isOpen={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        submitButtonText="Hapus"
        onSubmit={handleRemove}
        className="w-96"
        buttonFullWidth
      />

      <EditDocumentDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        id={selectedId}
        name={selectedName}
      />

      <DocumentDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        id={selectedId}
        name={selectedName}
        file_path={selectedFilePath}
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

export default DocumentAITable;
