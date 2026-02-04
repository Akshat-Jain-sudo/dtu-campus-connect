import { useMarkAsRead } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/database";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const markAsRead = useMarkAsRead();

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "listing_approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "listing_rejected":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "new_message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "listing":
        return <Package className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-3 p-4 rounded-lg text-left transition-colors hover:bg-muted/50",
        !notification.is_read && "bg-primary/5"
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("font-medium", !notification.is_read && "text-foreground")}>
            {notification.title}
          </p>
          {!notification.is_read && (
            <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
          )}
        </div>
        {notification.message && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {notification.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
    </button>
  );
}
