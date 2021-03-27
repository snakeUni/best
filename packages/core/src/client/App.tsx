import * as React from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import { SiteData, ThemeConfig } from '../type'

// 用户配置的所有数据
import config from '@!virtual-modules/data'
import Theme from '@!virtual-modules/theme'
import pages from '@!virtual-modules/pages'

export default function App() {
  return (
    <BrowserRouter>
      <Theme>
        <Switch>
          {pages.map(p => {
            return getPageRoute(p)
          })}
        </Switch>
        <Redirect to="/" />
      </Theme>
    </BrowserRouter>
  )
}

function getPageRoute(path: string) {
  return <Route key="same" exact path={path} component={require(path).default}></Route>
}
