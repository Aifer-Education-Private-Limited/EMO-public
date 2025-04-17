'use client'

import Chat from '@/app/components/Chat/Chat'
import { fetchUserById } from '@/app/constants/features/user'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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