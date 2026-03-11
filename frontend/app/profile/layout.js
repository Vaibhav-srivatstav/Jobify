import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata = {
    title: "Profile | Jobify",
    description: "Manage your profile and settings.",
};
export default function ProfilePage({children}) {
    return (
        <ProtectedRoute>
        {children}
        </ProtectedRoute>
    );
}