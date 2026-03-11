import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata = {
    title: "Dashboard | Jobify",
    description: "Your personalized dashboard to track and manage job applications.",
};
export default function DashboardPage({children}) {
    return (
        <ProtectedRoute>
        {children}
        </ProtectedRoute>
    );
}