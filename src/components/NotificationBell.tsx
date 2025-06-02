import { useEffect, useState } from 'react';
import { Bell, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Notification {
  id: string;
  message: string;
  type: string;
  read_status: boolean;
  created_at: string;
}

const NotificationBell = ({ userId }: { userId: string }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // Récupérer le nombre de notifications non lues
  const fetchUnread = async () => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read_status', false);
    if (!error && typeof count === 'number') setUnreadCount(count);
  };

  // Récupérer la liste des notifications
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (!error && data) setNotifications(data);
  };

  useEffect(() => {
    fetchUnread();
    fetchNotifications();
    // Optionnel : Supabase Realtime
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => {
        fetchUnread();
        fetchNotifications();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Marquer comme lues
  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('user_id', userId)
      .eq('read_status', false);
    fetchUnread();
    fetchNotifications();
  };

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen((o) => !o)} className="relative focus:outline-none">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 z-50">
          <Card className="p-2 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Notifications</span>
              <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">Tout marquer comme lu</button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {notifications.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-4">Aucune notification</div>
              ) : notifications.map((notif) => (
                <div key={notif.id} className={`flex items-start gap-2 p-2 rounded ${notif.read_status ? 'bg-gray-50' : 'bg-blue-50'}`}>
                  <Badge variant={notif.read_status ? 'secondary' : 'outline'}>{notif.type}</Badge>
                  <div className="flex-1">
                    <div className="text-sm">{notif.message}</div>
                    <div className="text-xs text-gray-400">{new Date(notif.created_at).toLocaleString('fr-FR')}</div>
                  </div>
                  <button
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Voir le détail"
                    onClick={() => alert(`Détail de la notification :\n${notif.message}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Supprimer"
                    onClick={async () => {
                      await supabase.from('notifications').delete().eq('id', notif.id);
                      fetchUnread();
                      fetchNotifications();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 