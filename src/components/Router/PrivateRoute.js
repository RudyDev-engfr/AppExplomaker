import React, { useContext } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'

import { SessionContext } from '../../contexts/session'

const PrivateRoute = ({ path, children }) => {
  const location = useLocation()
  const { user } = useContext(SessionContext)

  return (
    <Route path={path}>
      {user.isLoggedIn ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { redirectedFrom: location },
          }}
        />
      )}
    </Route>
  )
}

export default PrivateRoute
