import React from 'react'
import styled from 'styled-components'

interface CardProps {
  className?: string
  title?: string | React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}

const Card: React.FC<CardProps> = (props) => {
  return (
    <Wrapper className={props.className}>
      {(props.title || props.actions) && (
        <Header>
          <h3>{props.title}</h3>
          <Action>{props.actions}</Action>
        </Header>
      )}
      {props.children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: var(--padding);
  border-radius: var(--border-radius);
  background-color: var(--light-color);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--padding);

  > h3 {
    margin: 0;
    font-size: 16px;
  }
`

const Action = styled.div``

export default React.memo(Card)
