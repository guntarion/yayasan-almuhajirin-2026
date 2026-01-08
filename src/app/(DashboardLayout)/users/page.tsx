'use client';

import React, { useEffect, useState } from 'react';
import CommonBreadcrumb from '@/components/shared/CommonBreadcrumb';
import RoleGuard from '@/components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Shield, UserCog } from 'lucide-react';

type Role =
  | 'admin'
  | 'pengurus'
  | 'pengawas'
  | 'pembina'
  | 'kepalabidang'
  | 'kepalaunit'
  | 'operatorunit'
  | 'sekretariat'
  | 'member'
  | 'moderator'
  | 'editor'
  | 'viewer'
  | 'guest';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * User management page for administrators
 * Displays list of users and allows role changes
 */
const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState<Role | ''>('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Invalid data format:', data);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
        setShowModal(false);
        setSelectedUser(null);
        setNewRole('');
      } else {
        console.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setUpdating(false);
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowModal(true);
  };

  const getRoleBadgeColor = (role: Role): string => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white';
      case 'pengurus':
      case 'pengawas':
      case 'pembina':
        return 'bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] text-white';
      case 'kepalabidang':
      case 'kepalaunit':
        return 'bg-gradient-to-r from-[#00838F] to-[#006064] text-white';
      case 'operatorunit':
      case 'sekretariat':
        return 'bg-gradient-to-r from-[#4CAF50] to-[#388E3C] text-white';
      case 'moderator':
        return 'bg-[#FF9800] text-white';
      case 'editor':
        return 'bg-[#80DEEA] text-[#006064]';
      case 'member':
        return 'bg-[#B2EBF2] text-[#006064]';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getRoleIcon = (role: Role) => {
    if (['admin', 'pengurus', 'pengawas', 'pembina'].includes(role)) {
      return <Shield className="h-3 w-3" />;
    } else if (['kepalabidang', 'kepalaunit', 'operatorunit', 'sekretariat'].includes(role)) {
      return <UserCog className="h-3 w-3" />;
    }
    return <Users className="h-3 w-3" />;
  };

  const roleGroups = {
    'Leadership': ['admin', 'pengurus', 'pengawas', 'pembina'],
    'Management': ['kepalabidang', 'kepalaunit', 'operatorunit', 'sekretariat'],
    'General': ['member', 'moderator', 'editor', 'viewer', 'guest'],
  };

  const getRoleLabel = (role: Role): string => {
    const labels: Record<Role, string> = {
      admin: 'Admin',
      pengurus: 'Pengurus',
      pengawas: 'Pengawas',
      pembina: 'Pembina',
      kepalabidang: 'Kepala Bidang',
      kepalaunit: 'Kepala Unit',
      operatorunit: 'Operator Unit',
      sekretariat: 'Sekretariat',
      member: 'Member',
      moderator: 'Moderator',
      editor: 'Editor',
      viewer: 'Viewer',
      guest: 'Guest',
    };
    return labels[role];
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <CommonBreadcrumb pageTitle='User Management' parent='Administration' />

      {/* Page Header with Theme */}
      <div className='relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10 mb-6'>
        <div className='absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl' />
        <div className='absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-[#B2EBF2]/30 to-[#00BCD4]/20 rounded-full blur-2xl' />

        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full' />
            <h1 className='text-3xl font-bold text-[#006064]'>User Management</h1>
          </div>
          <p className='text-sm text-gray-600 ml-4'>Kelola peran dan izin pengguna sistem</p>
        </div>
      </div>

      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='col-span-1'>
            <div className='rounded-2xl bg-card shadow-lg border-2 border-gray-100'>
              <div className='bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10 p-6'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-[#B2EBF2]'>
                    <Users className='h-5 w-5 text-[#006064]' />
                  </div>
                  <div>
                    <h2 className='text-xl font-bold text-[#006064]'>Daftar Pengguna</h2>
                    <p className='text-sm text-gray-600'>Total: {users.length} pengguna</p>
                  </div>
                </div>
              </div>

              <div className='p-6'>
                {loading ? (
                  <div className='flex justify-center py-12'>
                    <div className='relative'>
                      <div className='absolute inset-0 bg-gradient-to-r from-[#00BCD4] to-[#006064] rounded-full blur-md opacity-30 animate-pulse' />
                      <Loader2 className='h-10 w-10 animate-spin text-[#00BCD4] relative' />
                    </div>
                  </div>
                ) : users.length === 0 ? (
                  <div className='p-8 text-center'>
                    <div className='mx-auto w-16 h-16 rounded-full bg-[#B2EBF2]/50 flex items-center justify-center mb-4'>
                      <Users className='h-8 w-8 text-[#006064]' />
                    </div>
                    <p className='text-gray-600 font-medium'>Tidak ada pengguna ditemukan</p>
                    <p className='text-sm text-gray-500 mt-1'>Silakan coba lagi nanti</p>
                  </div>
                ) : (
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow className='bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10'>
                          <TableHead className='font-bold text-[#006064]'>Nama</TableHead>
                          <TableHead className='font-bold text-[#006064]'>Email</TableHead>
                          <TableHead className='font-bold text-[#006064]'>Role</TableHead>
                          <TableHead className='font-bold text-[#006064] text-center'>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className='hover:bg-[#B2EBF2]/20 transition-colors'>
                            <TableCell className='font-medium text-gray-900'>{user.name}</TableCell>
                            <TableCell className='text-gray-600'>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={`${getRoleBadgeColor(user.role)} font-semibold px-3 py-1 rounded-full flex items-center gap-1 w-fit`}>
                                {getRoleIcon(user.role)}
                                {getRoleLabel(user.role)}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-center'>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => openRoleModal(user)}
                                className='border-2 border-[#00BCD4]/30 hover:border-[#00BCD4] hover:bg-[#B2EBF2]/20 rounded-xl font-semibold text-[#006064]'
                              >
                                <UserCog className='h-4 w-4 mr-2' />
                                Ubah Role
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for changing role - Enhanced with theme */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className='sm:max-w-[500px] rounded-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold text-[#006064] flex items-center gap-2'>
              <div className='p-2 rounded-lg bg-[#B2EBF2]'>
                <UserCog className='h-5 w-5 text-[#006064]' />
              </div>
              Ubah Role Pengguna
            </DialogTitle>
            <DialogDescription className='text-gray-600'>
              Perbarui role untuk{' '}
              <span className='font-medium text-[#006064]'>{selectedUser?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            {/* Current Role Display */}
            <div className='p-4 rounded-xl bg-gradient-to-r from-[#B2EBF2]/20 to-[#80DEEA]/10 border border-[#00BCD4]/20'>
              <p className='text-sm font-medium text-gray-600 mb-2'>Role Saat Ini:</p>
              {selectedUser && (
                <Badge className={`${getRoleBadgeColor(selectedUser.role)} font-semibold px-4 py-2 rounded-full flex items-center gap-2 w-fit`}>
                  {getRoleIcon(selectedUser.role)}
                  {getRoleLabel(selectedUser.role)}
                </Badge>
              )}
            </div>

            {/* New Role Selection */}
            <div className='space-y-3'>
              <Label htmlFor='role' className='text-base font-semibold text-[#006064] flex items-center gap-2'>
                <Shield className='h-4 w-4 text-[#00BCD4]' />
                Pilih Role Baru
              </Label>
              <Select value={newRole} onValueChange={(value) => setNewRole(value as Role)}>
                <SelectTrigger className='w-full border-2 focus:border-[#00BCD4] rounded-xl h-12'>
                  <SelectValue placeholder='Pilih role' />
                </SelectTrigger>
                <SelectContent className='max-h-[400px]'>
                  {Object.entries(roleGroups).map(([group, roles]) => (
                    <div key={group}>
                      <div className='px-2 py-1.5 text-xs font-bold text-[#006064] bg-[#B2EBF2]/30 sticky top-0'>
                        {group}
                      </div>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role} className='pl-6'>
                          <div className='flex items-center gap-2'>
                            {getRoleIcon(role as Role)}
                            <span>{getRoleLabel(role as Role)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setShowModal(false)}
              disabled={updating}
              className='border-2 border-gray-300 hover:bg-gray-100 rounded-xl'
            >
              Batal
            </Button>
            <Button
              onClick={handleRoleChange}
              disabled={updating || !newRole || newRole === selectedUser?.role}
              className='bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'
            >
              {updating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Memperbarui...
                </>
              ) : (
                <>
                  <UserCog className='mr-2 h-4 w-4' />
                  Perbarui Role
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
};

export default UsersPage;
