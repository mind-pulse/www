import { Badge } from 'antd-mobile'
import type { ReactNode } from 'react'

interface BadgeProps {
  badge: ReactNode
  content: ReactNode
  right: number
}

const BaseBadge = ({ badge, content, right }: BadgeProps) => {
  return (
    <Badge
      content={badge}
      color="#108ee9"
      style={{ '--right': `-${right}px`, '--top': '8px' }}
    >
      {content}
    </Badge>
  )
}

export default BaseBadge
