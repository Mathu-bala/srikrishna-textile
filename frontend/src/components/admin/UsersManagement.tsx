import { useState, useEffect } from 'react';
import {
    Search, User, Mail, Phone, MapPin, Calendar,
    Shield, ShieldAlert, Eye, Ban, CheckCircle, XCircle
} from 'lucide-react';
import { getAdminUsers, updateAdminUserStatus } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserData {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isBlocked: boolean;
    phone: string;
    address: string;
    profilePhoto: string;
    lastLogin: string;
    orderCount: number;
    createdAt: string;
}

const UsersManagement = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAdminUsers(searchQuery, page, 10);
            setUsers(data.users);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchQuery, page]);

    // Reset page when search changes
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
        try {
            await updateAdminUserStatus(userId, !currentStatus);
            // Refresh user list
            fetchUsers();
            // If modal is open for this user, updated selectedUser
            if (selectedUser?._id === userId) {
                setSelectedUser({ ...selectedUser, isBlocked: !currentStatus });
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const openUserDetail = (user: UserData) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display">User <span className="text-gradient-neon">Management</span></h2>
                    <p className="text-muted-foreground text-sm">View and manage all registered users</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-muted/50 border-border/50"
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Contact</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                                <th className="text-left p-4 font-medium text-muted-foreground text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-primary/20">
                                                    <AvatarImage src={user.profilePhoto} alt={user.name} />
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {user.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">ID: {user._id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">
                                                <p className="flex items-center gap-1.5"><Mail size={12} className="text-muted-foreground" /> {user.email}</p>
                                                {user.phone && <p className="flex items-center gap-1.5"><Phone size={12} className="text-muted-foreground" /> {user.phone}</p>}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {user.isAdmin ? (
                                                <Badge className="bg-secondary/20 text-secondary border-secondary/30">Admin</Badge>
                                            ) : (
                                                <Badge variant="outline">User</Badge>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {user.isBlocked ? (
                                                <Badge className="bg-destructive/20 text-destructive border-destructive/30">Blocked</Badge>
                                            ) : (
                                                <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">Active</Badge>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openUserDetail(user)}
                                                    className="hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleStatusToggle(user._id, user.isBlocked)}
                                                    className={user.isBlocked ? "hover:bg-neon-green/10 hover:text-neon-green" : "hover:bg-destructive/10 hover:text-destructive"}
                                                >
                                                    {user.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-4">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="border-border/50"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            className="border-border/50"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-card border-border/50 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display">User <span className="text-gradient-neon">Profile</span></DialogTitle>
                        <DialogDescription>
                            Details and management for {selectedUser?.name}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-5 pb-6 border-b border-border/30">
                                <Avatar className="h-24 w-24 border-2 border-primary/30 shadow-neon-purple">
                                    <AvatarImage src={selectedUser.profilePhoto} />
                                    <AvatarFallback className="text-2xl">{selectedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                                    <p className="text-muted-foreground mb-2">{selectedUser.email}</p>
                                    <div className="flex gap-2">
                                        {selectedUser.isAdmin ? (
                                            <Badge className="bg-secondary/20 text-secondary border-secondary/30">Administrator</Badge>
                                        ) : (
                                            <Badge variant="outline">Customer</Badge>
                                        )}
                                        {selectedUser.isBlocked ? (
                                            <Badge className="bg-destructive/20 text-destructive border-destructive/30">Blocked</Badge>
                                        ) : (
                                            <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">Active</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Phone Number</p>
                                    <p className="flex items-center gap-2"><Phone size={14} className="text-primary" /> {selectedUser.phone || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Last Login</p>
                                    <p className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Shipping Address</p>
                                    <p className="flex items-start gap-2"><MapPin size={14} className="text-primary mt-1" /> {selectedUser.address || 'No address provided'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                                <div className="bg-muted/30 p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-secondary">{selectedUser.orderCount}</p>
                                    <p className="text-xs text-muted-foreground uppercase">Total Orders</p>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-primary">{new Date(selectedUser.createdAt).getFullYear()}</p>
                                    <p className="text-xs text-muted-foreground uppercase">Member Since</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    className={`flex-1 ${selectedUser.isBlocked ? 'btn-neon' : 'bg-destructive hover:bg-destructive/90 text-white'}`}
                                    onClick={() => handleStatusToggle(selectedUser._id, selectedUser.isBlocked)}
                                >
                                    {selectedUser.isBlocked ? (
                                        <><CheckCircle size={18} className="mr-2" /> Activate Account</>
                                    ) : (
                                        <><Ban size={18} className="mr-2" /> Deactivate Account</>
                                    )}
                                </Button>
                                <Button variant="outline" className="flex-1 border-border/50">
                                    Reset Password
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UsersManagement;
