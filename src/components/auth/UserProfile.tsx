// src/components/auth/UserProfile.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Shield } from 'lucide-react';

/**
 * Role display labels for Yayasan Al Muhajirin
 */
const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  pengurus: 'Pengurus',
  pengawas: 'Pengawas',
  pembina: 'Pembina',
  kepalabidang: 'Kepala Bidang',
  kepalaunit: 'Kepala Unit',
  operatorunit: 'Operator Unit',
  sekretariat: 'Sekretariat',
  member: 'Anggota',
  moderator: 'Moderator',
  editor: 'Editor',
  viewer: 'Viewer',
  guest: 'Tamu',
};

/**
 * Role badge colors
 */
const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 border-red-200',
  pengurus: 'bg-purple-100 text-purple-700 border-purple-200',
  pengawas: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  pembina: 'bg-blue-100 text-blue-700 border-blue-200',
  kepalabidang: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  kepalaunit: 'bg-teal-100 text-teal-700 border-teal-200',
  operatorunit: 'bg-green-100 text-green-700 border-green-200',
  sekretariat: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  member: 'bg-gray-100 text-gray-700 border-gray-200',
  moderator: 'bg-orange-100 text-orange-700 border-orange-200',
  editor: 'bg-pink-100 text-pink-700 border-pink-200',
  viewer: 'bg-slate-100 text-slate-700 border-slate-200',
  guest: 'bg-zinc-100 text-zinc-700 border-zinc-200',
};

interface UserProfileProps {
  variant?: 'dropdown' | 'card';
  showLogout?: boolean;
}

/**
 * User profile component that displays user info and role
 * Can be rendered as dropdown menu or card
 */
export default function UserProfile({ variant = 'dropdown', showLogout = true }: UserProfileProps) {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const roleLabel = ROLE_LABELS[user.role] || user.role;
  const roleColor = ROLE_COLORS[user.role] || ROLE_COLORS.member;

  // Get user initials for avatar fallback
  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  if (variant === 'card') {
    return (
      <Card className="border-[#00BCD4]/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#00BCD4]" />
            Informasi Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-[#00BCD4]/30">
              <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-[#00BCD4] to-[#006064] text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-[#006064]">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Role:</p>
            <Badge className={`${roleColor} border font-medium`}>{roleLabel}</Badge>
          </div>
          {showLogout && (
            <Button
              onClick={logout}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-[#00BCD4]/30">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-[#00BCD4] to-[#006064] text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-10 w-10 border-2 border-[#00BCD4]/30">
              <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-[#00BCD4] to-[#006064] text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-[#006064] leading-none">{user.name}</p>
              <p className="text-xs text-gray-500 leading-none">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Role:</span>
            <Badge className={`${roleColor} border text-xs font-medium`}>{roleLabel}</Badge>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profil Saya</span>
        </DropdownMenuItem>
        {showLogout && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
