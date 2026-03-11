import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata = {
    title: "Jobs | Jobify",
    description: "Browse and apply to jobs.",
};
export default function JobsPage({children}) {
    return (
        <ProtectedRoute>
        {children}
        </ProtectedRoute>
    );
}