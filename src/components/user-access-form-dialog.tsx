import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmationDialog from "./confirmation-dialog";
import InformationDialog from "./information-dialog";
import { Checkbox } from "./ui/checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/user";
import { ColumnDef, Row } from "@tanstack/react-table";
import { z } from "zod";
import { GetUserAccessListResponseSchema } from "@/lib/schema";

type UserAccess = z.infer<
  typeof GetUserAccessListResponseSchema
>["data"]["accesses"][0];

export const FormAccess = ({
  open,
  onClose,
  userId,
  userName,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}) => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showInformationDialog, setShowInformationDialog] = useState(false);
  const [selectedAccessIds, setSelectedAccessIds] = useState<string[]>([]);

  const { data: userAccesses, isLoading } = useQuery({
    queryKey: ["user-accesses", userId],
    queryFn: () =>
      UserService.getUserAccessList({
        id: userId,
      }),
    enabled: open,
  });

  useEffect(() => {
    if (userAccesses) {
      const selectedAccessIds = userAccesses.data.accesses
        .filter((access) => access.enabled)
        .map((access) => access.id);
      setSelectedAccessIds(selectedAccessIds);
    }
  }, [userAccesses]);

  const handleCheckboxChange = (id: string) => {
    const newSelectedAccessIds = selectedAccessIds.includes(id)
      ? selectedAccessIds.filter((accessId) => accessId !== id)
      : [...selectedAccessIds, id];

    setSelectedAccessIds(newSelectedAccessIds);
  };

  const queryClient = useQueryClient();

  const { mutate: assignUserAccess, isPending } = useMutation({
    mutationFn: UserService.assignUserAccess,
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["user-accesses", userId] });
        setShowConfirmationDialog(false);
        setShowInformationDialog(true);
      }
    },
    onError: (error) => {
      console.error("Error saving access:", error);
    },
  });

  const handleSave = async () => {
    await assignUserAccess({
      id: userId,
      accesses: selectedAccessIds,
    });
  };

  const handleCloseInformationDialog = () => {
    onClose();
    setShowInformationDialog(false);
  };

  const handleOPenConfirmationDialog = () => {
    setShowConfirmationDialog(true);
  };

  const columns: ColumnDef<UserAccess>[] = [
    {
      accessorKey: "group",
      header: "Modul",
    },
    {
      accessorKey: "description",
      header: "Fungsi",
    },
    {
      accessorKey: "type",
      header: "Tipe",
      cell: ({ row }) => {
        const colors: Record<"READ" | "CREATE" | "UPDATE" | "DELETE", string> =
          {
            READ: "text-green-500",
            CREATE: "text-blue-500",
            UPDATE: "text-yellow-500",
            DELETE: "text-red-500",
          };

        return (
          <span
            className={`text-sm font-semibold ${colors[row.original.type as "READ" | "CREATE" | "UPDATE" | "DELETE"]}`}
          >
            {row.original.type}
          </span>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Aksi",
      cell: ({ row }: { row: Row<UserAccess> }) => (
        <Checkbox
          checked={selectedAccessIds.includes(row.original.id)}
          onCheckedChange={() => handleCheckboxChange(row.original.id)}
        />
      ),
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Konfigurasi Akses</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[60vh]">
              <DataTable
                data={userAccesses?.data.accesses || []}
                columns={columns}
                clientSideFiltering
                clientSidePagination
                clientSideSorting
                searchKey="description"
                extra={<div className="text-xl font-bold">Pengguna: {userName}</div>}
              />
            </div>
          )}
          <div className="flex justify-end mt-4 gap-3">
            <Button onClick={onClose} variant="outline" disabled={isLoading}>
              Batal
            </Button>
            <Button onClick={handleOPenConfirmationDialog}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {showConfirmationDialog && (
        <ConfirmationDialog
          title="Simpan Perubahan?"
          description="Apakah anda yakin ingin menyimpan perubahan?"
          buttonText="Batal"
          isOpen={showConfirmationDialog}
          onClose={() => setShowConfirmationDialog(false)}
          onSubmit={handleSave}
          submitButtonDisabled={isPending}
          submitButtonText={
            isPending ? (
              <>
                Menyimpan...
                <Loader className="animate-spin" size={20} />
              </>
            ) : (
              "Simpan"
            )
          }
        />
      )}

      {showInformationDialog && (
        <InformationDialog
          illustrationType="success"
          title="Berhasil!"
          description="Hak akses pengguna berhasil diubah."
          buttonText="Selesai"
          isOpen={showInformationDialog}
          onClose={handleCloseInformationDialog}
        />
      )}
    </>
  );
};

export default FormAccess;
