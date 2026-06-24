export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("Navegador não suporta notificações de desktop.");
    return "denied";
  }

  let permission = Notification.permission;
  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }
  return permission;
}

export function sendMockPushNotification(title: string, body: string, url?: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification(title, {
    body,
    icon: "/favicon.ico", // Fallback ou um logo
    tag: "cidadão-conectado-alert",
    badge: "/favicon.ico"
  });

  if (url) {
    notification.onclick = function(event) {
      event.preventDefault();
      window.open(url, "_blank");
      notification.close();
    };
  }
}
