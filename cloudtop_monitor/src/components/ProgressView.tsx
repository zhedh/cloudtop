import { useEffect, useId } from 'react'
import styled from 'styled-components'

interface Props {
  radio: number // 圆环进度比例
  radius?: number // 圆环半径
  lineWidth?: number // 圆环宽度
  color?: string // 圆环前景色
  background?: string // 圆环背景色
  children?: React.ReactNode
}

const DEFAULT_RADIO = 50
const DEFAULT_COLOR = '#8bbb11'
const DEFAULT_BACKGROUND = '#f5f5f5'
const DEFALUT_DPR = 4 // canvas 缩放倍数

const ProgressView = (props: Props) => {
  const id = useId()
  const {
    radius = DEFAULT_RADIO,
    color = DEFAULT_COLOR,
    background = DEFAULT_BACKGROUND,
    radio,
  } = props
  const lineWidth = props.lineWidth || radius / 10
  const maxRadian = (radio / 1) * Math.PI * 2
  let progressRadian = 0

  useEffect(() => {
    const canvas = document.getElementById(id) as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!

    canvas.width = radius * DEFALUT_DPR * 2
    canvas.height = radius * DEFALUT_DPR * 2
    ctx.scale(DEFALUT_DPR, DEFALUT_DPR)

    startDrawProgress(ctx)
  }, [props.radio])

  const drawProgress = (ctx: CanvasRenderingContext2D, radian: number) => {
    let path = new Path2D()
    path.arc(radius, radius, radius - lineWidth / 2, 0, Math.PI * 2)
    ctx.strokeStyle = background
    ctx.lineWidth = lineWidth
    ctx.stroke(path)

    path = new Path2D()
    path.arc(radius, radius, radius - lineWidth / 2, 0, radian)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke(path)
  }

  const startDrawProgress = (ctx: CanvasRenderingContext2D) => {
    if (progressRadian >= maxRadian) {
      drawProgress(ctx, maxRadian)
      return
    }
    drawProgress(ctx, progressRadian)
    progressRadian += (Math.PI * 2) / 100

    setTimeout(() => {
      startDrawProgress(ctx)
    }, 10)
  }

  return (
    <Wrapper radius={radius} color={color}>
      <aside>
        {props.children ? (
          props.children
        ) : (
          <span className="radio">{(radio * 100).toFixed(0)}</span>
        )}
      </aside>
      <canvas id={id}></canvas>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ radius: number; color: string }>`
  position: relative;
  display: inline-block;
  font-size: 0;

  > aside {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;

    > span.radio {
      font-size: ${(props) => props.radius / 2}px;
      color: ${(props) => props.color};
    }
  }

  > canvas {
    width: ${(props) => props.radius * 2}px;
    height: ${(props) => props.radius * 2}px;
  }
`

export default ProgressView
