"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserById } from "../constants/features/user";
import Login from "./Login/Login";

const ProtectedRoute = ({ children, route }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.user.value);
    const [loading, setLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            await dispatch(fetchUserById());
            setLoading(false);
        };

        fetchUser();
    }, [dispatch]);

    useEffect(() => {
        if (!loading && !user?.id) {
            // router.push("/");
            setShowLogin(true)
        }
    }, [user, loading, router]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <>
            {user?.id ? children : null}
            {showLogin && <Login URL={route} handleClose={() => setShowLogin(false)} />}
        </>
    );
};

export default ProtectedRoute;