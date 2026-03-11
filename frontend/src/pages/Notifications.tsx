import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/api';
import { Bell, CheckCheck, Package, AlertTriangle, Gift, Info, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Notification {
    _id: string;
    message: string;
    type: 'order' | 'system' | 'offer' | 'alert';
    isRead: boolean;
    relatedId?: string;
    createdAt: string;
}

const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const Notifications = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchNotifications();
    }, [isAuthenticated]);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('All marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification._id);
        }

        // Navigation logic based on type and role
        if (notification.type === 'order' && notification.relatedId) {
            if (user?.isAdmin) {
                // Admin shouldn't really go to user track page, but we don't have deep link for admin orders strictly defined in client yet?
                // Actually we have /admin/dashboard -> Orders tab. 
                // For now let's just go to dashboard, or if user go to order tracking
                navigate('/admin');
            } else {
                navigate(`/orders/${notification.relatedId}`);
            }
        } else if (notification.type === 'system' && notification.relatedId) {
            // Like "system" for new products, navigate to product
            if (notification.relatedId) navigate(`/product/${notification.relatedId}`);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <Package className="text-blue-500" />;
            case 'alert': return <AlertTriangle className="text-red-500" />;
            case 'offer': return <Gift className="text-purple-500" />;
            default: return <Info className="text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow container-custom py-8">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-serif font-semibold">Notifications</h1>
                    {notifications.length > 0 && notifications.some(n => !n.isRead) && (
                        <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="flex gap-2">
                            <CheckCheck size={16} /> Mark all read
                        </Button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                            <Bell size={40} className="text-muted-foreground/50" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">All caught up!</h2>
                        <p className="text-muted-foreground">There are no new notifications for you.</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${notification.isRead
                                    ? 'bg-card border-border/40 opacity-70'
                                    : 'bg-card border-primary/20 shadow-sm border-l-4 border-l-primary'
                                    }`}
                            >
                                <div className={`mt-1 p-2 rounded-full h-fit flex-shrink-0 ${notification.isRead ? 'bg-muted/10' : 'bg-primary/10'}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm mb-1 ${notification.isRead ? 'text-foreground' : 'font-medium text-foreground'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {getTimeAgo(new Date(notification.createdAt))}
                                    </p>
                                </div>
                                {!notification.isRead && (
                                    <div className="flex flex-col justify-center">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Notifications;
