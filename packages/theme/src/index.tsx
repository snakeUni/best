import * as React from 'react'

interface AppProps extends React.PropsWithChildren<React.Component> {}

export default function App({ children }: AppProps) {
  return <div>{children}</div>
}
