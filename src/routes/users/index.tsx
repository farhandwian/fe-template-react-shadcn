import UserDataTable from "@/components/features/users/user-data-table";
import HeaderDashboard from "@/components/header-dashboard";
import SidebarLayout from "@/components/sidebar-layout";
import UserDetailsDialog from "@/components/user-details-dialog";
import { createFileRoute, redirect } from "@tanstack/react-router";
import UserIcon from "/src/assets/user-white-28.svg";

export const Route = createFileRoute("/users/")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.auth) {
      throw redirect({
        to: "/welcome",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  validateSearch: (
    search: Record<string, string>
  ): {
    id?: string;
  } => {
    return {
      id: search?.id,
    };
  },
  component: User,
});

function User() {
  const { id: detailUserId } = Route.useSearch();

  return (
    <SidebarLayout>
      {/* header */}
      <HeaderDashboard
        icon={UserIcon}
        title1="Manajemen Pengguna"
        title2="Manajemen Pengguna"
      />

      {/* content */}
      <div className="bg-white rounded-2xl w-full p-7 my-7">
        <div className="text-xl font-semibold">Daftar Pengguna</div>

        <div className="mt-7">
          <UserDataTable />
        </div>

        {detailUserId && <UserDetailsDialog userId={detailUserId} />}
      </div>
    </SidebarLayout>
  );
}
