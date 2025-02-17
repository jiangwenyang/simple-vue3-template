import { useMessage } from 'naive-ui'
import { logger } from '@/libs/log'

declare global {
  interface Window {
    $message: ReturnType<typeof useMessage>
    $logger: typeof logger
  }
}
