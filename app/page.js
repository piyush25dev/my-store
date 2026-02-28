import StorePremium from '@/components/direction-3-premium/store'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div>
      <StorePremium/>
      <div className='flex justify-center gap-2 py-6'>
        <Link href="/dashboard/admin/overview">Admin Dashboard</Link>
      <Link href="/dashboard/creator/overview">Creator Dashboard</Link>
      </div>
    </div>
  )
}
