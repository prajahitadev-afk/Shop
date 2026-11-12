export interface NotificationRecord {
  id: string
  title: string
  message: string
  type: string
  notification_type: string
  related_entity_type: string
  related_entity_id: string
  is_read: boolean
  created_at: string
}
