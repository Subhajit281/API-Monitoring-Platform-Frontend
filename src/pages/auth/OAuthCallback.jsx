import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            navigate("/login");
            return;
        }

        localStorage.setItem("token", token);

        navigate("/");
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg font-medium">
                Signing you in...
            </p>
        </div>
    );
};

export default OAuthCallback;