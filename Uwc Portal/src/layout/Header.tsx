import {
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MobileMenuButton } from './Sidebar'

interface HeaderProps {
  onMenuClick: () => void
  pageTitle?: string
}

export function Header({ onMenuClick, pageTitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white px-4 sm:px-6">
      <MobileMenuButton onClick={onMenuClick} />
      
      {/* Page Title (Mobile) */}
      {pageTitle && (
        <h1 className="text-lg font-semibold text-neutral-900 lg:hidden">
          {pageTitle}
        </h1>
      )}

      {/* Search (Desktop) */}
      <div className="hidden md:flex flex-1 items-center gap-4 md:gap-8">
        <form className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search applications, programs..."
              className="pl-10 bg-neutral-50 border-neutral-200"
            />
          </div>
        </form>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Profile Dropdown (Simplified) */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-neutral-900">Mathew James</p>
            <p className="text-xs text-neutral-500">Student</p>
          </div>
          <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 transition-all">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary-100 text-primary-700">MJ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
