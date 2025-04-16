'use client'

import Chat from '@/app/components/Chat/Chat'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { usePathname } from 'next/navigation'

const Page = () => {
    const route = usePathname()

    return (
        <ProtectedRoute route={route}>
            <Chat />
        </ProtectedRoute>
    )
}

export default Page;