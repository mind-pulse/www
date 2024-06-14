import { Button } from 'antd-mobile'
import type { ReactNode } from 'react'

interface IdeaProps {
  content: ReactNode[]
  hide: () => void
}

const Idea = ({ content, hide }: IdeaProps) => {
  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
        }}
      >
        理念介绍
      </div>

      <div className="indent text">
        {content.map((s, i) => (
          <div key={i} style={{ marginTop: '1rem' }}>
            {s}
          </div>
        ))}
      </div>

      <Button
        color="primary"
        block
        onClick={hide}
        style={{ marginTop: '2rem' }}
      >
        开始测试
      </Button>
    </div>
  )
}

export default Idea
