import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { NoticeBar, ErrorBlock, Button, WaterMark } from 'antd-mobile'
import { HomeOutlined } from '@ant-design/icons'
import suspense from '~/advance/suspense'
import {
  LazySCL90Result,
  Lazy16pfResult,
  LazyCommonResult,
  LazyYbocsResult,
  LazyEPTResult,
  LazyEpqRscResult,
  LazyNeoPiRResult,
  LazyFooter,
  LazyHSDSResult,
} from '~/pages'
import './index.scss'
import Nav from '~/components/nav'

export const WARNING =
  '本测试结果仅供参考，不提供医疗建议，如果你确实感到不适可参考本结果去精神专科医院咨询心理医生。'

const Result = () => {
  const { path } = useParams() as { path: Path }
  const location = useLocation()
  const navigate = useNavigate()

  const toHome = () => navigate('/', { replace: true })

  if (!location.state) {
    return (
      <ErrorBlock
        fullPage
        status="empty"
        title="结果页不可直接访问"
        description="还是先去测试吧"
      >
        <Button color="primary" onClick={toHome}>
          回到主页
        </Button>
      </ErrorBlock>
    )
  }

  const render = () => {
    if (path === 'scl90') {
      return <LazySCL90Result />
    }

    if (path === '16pf') {
      return <Lazy16pfResult />
    }

    if (path === 'y_bocs') {
      return <LazyYbocsResult />
    }

    if (path === 'ept') {
      return <LazyEPTResult />
    }

    if (path === 'epq_rsc') {
      return <LazyEpqRscResult />
    }

    if (path === 'neo_pi_r') {
      return <LazyNeoPiRResult />
    }

    if (path === 'h_sds') {
      return <LazyHSDSResult />
    }

    return <LazyCommonResult />
  }

  return (
    <div className="main">
      <Nav
        title={location.state.name + '结果'}
        backArrow={<HomeOutlined />}
        onBack={toHome}
        className={path + '-result-nav'}
        showDonateOnLoad
        buttonFill={['neo_pi_r', 'h_sds'].includes(path) ? 'solid' : 'none'}
      />

      <NoticeBar
        wrap
        color="info"
        className={path + '-result-notice'}
        content="您的测试结果本网站不会保存，如果需要保存请截图。"
      />

      {suspense(render())}

      {suspense(<LazyFooter />)}

      <WaterMark
        content={['知己心理', 'https://scale.thepoy.cc']}
        fontColor="rgba(0, 0, 0, .05)"
      />
    </div>
  )
}

export default Result
