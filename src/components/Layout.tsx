import * as React from 'react'
import {
  Alert,
  AppLayout,
  Button,
  Container,
  ContentLayout,
  Header,
  Link,
  SpaceBetween,
} from '@cloudscape-design/components'

interface Props {
  title: string
  subtitle: string
  children: React.ReactNode
  description?: string
}

export const Layout: React.FC<Props> = ({
  title,
  subtitle,
  children,
  description,
}) => {
  return (
    <AppLayout
      content={
        <Container header={<Header variant="h2">{subtitle}</Header>}>
          {children}
        </Container>
      }
      toolsHide
      contentHeader={
        <Header variant="h1" description={description}>
          {title}
        </Header>
      }
      contentType="form"
      headerSelector="#header"
      footerSelector="#footer"
    />
  )
}
