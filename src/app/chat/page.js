'use client'

import { usePathname, useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import Chat from '../components/Chat/Chat'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchUserById } from '../constants/features/user'

const Page = () => {
    const userDetails = useSelector((state) => state.user.value)
    const router = useRouter()
    const dispatch = useDispatch()

    const getUser = async () => {
        const token = localStorage.getItem("studentToken");
        if (token) {
            dispatch(fetchUserById());
        } else {
            router.push('/')
        }
    };

    useEffect(() => {
        if (!userDetails) {
            localStorage.removeItem("studentToken");
            router.push('/');
        }
    }, [userDetails])

    useEffect(() => {
        getUser();
    }, [])

    return (
        // <ProtectedRoute route={route}>
        <Chat />
        // </ProtectedRoute>
    )
}

export default Page;