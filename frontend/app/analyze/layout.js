import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata = {
    title: "Resume Matcher | Jobify",
    description: "Analyze and optimize your resume for job applications.",
};
export default function AnalyzePage({children}) {
    return (
        <ProtectedRoute>
        {children}
        </ProtectedRoute>
    );
}