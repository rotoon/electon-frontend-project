import api from "@/lib/api";
import { ManageUsersResult, User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Hook to fetch Users (Admin)
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users?limit=1000");
      // Assuming API now returns User objects as per docs
      // If it returns "nationalId", we rely on mapping or type correctness
      // Docs say MeResponse has citizenId. Admin response likely similar.
      return (data.data || []).map((u: any) => ({
        ...u,
        // Map backend keys to frontend User type if needed
        // If backend returns camelCase, we are good for citizenId
        // If backend returns snake_case, we map.
        // Docs use camelCase for User.
        citizenId: u.citizenId || u.nationalId, // fallback
      })) as User[];
    },
  });
}

// Hook for Admin Users Page with server-side pagination
export function useManageUsers(params: {
  role?: string | null;
  page?: number;
  limit?: number;
}) {
  const { role, page = 1, limit = 10 } = params;

  return useQuery<ManageUsersResult>({
    queryKey: ["manage-users", role, page, limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());

      if (role && role !== "all") {
        queryParams.set("role", role);
      }

      const { data } = await api.get(`/admin/users?${queryParams.toString()}`);

      const rawData = data.data || [];
      const meta = data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

      const users = rawData.map((u: any) => ({
        id: u.id,
        // email: u.email, // Email removed from User type? No, docs don't show email in User.
        // But maybe Admin User view needs email?
        // docs/api_docs.md -> User interface has NO email.
        // So we remove email from display? Or keep it if backend sends it.
        // Let's assume strict adherence to docs -> No Email.
        citizenId: u.citizenId || u.nationalId,
        firstName: u.firstName,
        lastName: u.lastName,
        address: u.address,
        province: u.province,
        district: u.district,
        roles: u.roles,
        createdAt: u.createdAt,
      }));

      return { users, meta };
    },
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      await api.patch(`/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      toast.success("อัปเดตสิทธิ์สำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["manage-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: () => toast.error("อัปเดตไม่สำเร็จ"),
  });
}
