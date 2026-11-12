import { supabase } from '../lib/supabase'
import type { NotificationRecord } from '../types/notification.ts'
import { generateUUID } from '../lib/uuid'

export type CreateNotificationPayload = {
  title: string
  message: string
  type: string
  notificationType: string
  relatedEntityType: string
  relatedEntityId: string
  isRead?: boolean
}

export async function createNotification(payload: CreateNotificationPayload) {
  if (!supabase) {
    return { success: true as const, storedLocally: true }
  }

  try {
    const { error } = await supabase.from('notifications').insert({
      title: payload.title,
      message: payload.message,
      type: payload.type,
      notification_type: payload.notificationType,
      related_entity_type: payload.relatedEntityType,
      related_entity_id: payload.relatedEntityId,
      is_read: payload.isRead ?? false,
      created_at: new Date().toISOString(),
    })

    if (error) {
      return { success: false as const, error: error.message }
    }

    const notification: NotificationRecord = {
      id: generateUUID(),
      title: payload.title,
      message: payload.message,
      type: payload.type,
      notification_type: payload.notificationType,
      related_entity_type: payload.relatedEntityType,
      related_entity_id: payload.relatedEntityId,
      is_read: payload.isRead ?? false,
      created_at: new Date().toISOString(),
    }

    return { success: true as const, notification }
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unable to create notification.' }
  }
}
