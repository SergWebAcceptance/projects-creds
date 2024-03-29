import ProjectsList from '@/components/ProjectsList'
import SidebarNavigation from '@/components/SidebarNavigation'
import React from 'react'

function TradeProof() {
  return (
    <div className="flex gap-7 w-full mt-5">
        <div className="w-1/4">
          <SidebarNavigation category="TradeProof"/>
        </div>
        <div className="w-3/4">
          <ProjectsList category="TradeProof" />
        </div>
      </div>
  )
}

export default TradeProof