"use client";

import { useNotificationEngine } from "@/hooks/useNotificationEngine";

export function NotificationEngineRunner() {
  useNotificationEngine();
  return null;
}
