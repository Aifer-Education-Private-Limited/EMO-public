'use client'

import Chat from '../components/Chat/Chat'
import ProtectedRoute from '../components/ProtectedRoute'
import { usePathname } from 'next/navigation'

const Page = () => {
    const route = usePathname()

    return (
        // <ProtectedRoute route={route}>
            <Chat />
        //  </ProtectedRoute>
    )
}

export default Page;