import React, { useContext, useEffect } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'

import { SessionContext } from '../../contexts/session'
import PrivateRoute from './PrivateRoute'
import MyTrips from '../../pages/MyTrips'
import SignupSecondStep from '../../pages/Signup/SecondStep'
import SignupThirdStep from '../../pages/Signup/ThirdStep'
import SignupFourthStep from '../../pages/Signup/FourthStep'
import SignupFifthStep from '../../pages/Signup/FifthStep'
import PwdResetHandler from '../../pages/PwdResetHandler'
import JoinTrip from '../../pages/JoinTrip'
import TripFirst from '../../pages/NewTrip/TripFirst'
import TripSecond from '../../pages/NewTrip/TripSecond'
import TripThird from '../../pages/NewTrip/TripThird'
import TripFourth from '../../pages/NewTrip/TripFourth'
import TripFifth from '../../pages/NewTrip/TripFifth'
import TripRecap from '../../pages/NewTrip/TripRecap'
import TripPage from '../../pages/TripPage'
import Profile from '../../pages/Profile'
import Account from '../../pages/Profile/Account'
import Settings from '../../pages/Profile/Settings'
import Help from '../../pages/Profile/Help'
import HelpDetails from '../../pages/Profile/HelpDetails'

import TripContextProvider from '../../contexts/trip'
import TripGuide from '../../pages/TripPage/components/TripGuide'
import TripGuideItem from '../TripGuideItem'
import CreateTrip from '../CreateTrip'

const Routes = () => {
  const history = useHistory()
  const location = useLocation()
  const { user, needRedirectTo, setNeedRedirectTo } = useContext(SessionContext)

  useEffect(() => {
    if (user && location.pathname === '/' && needRedirectTo === 'newTrip') {
      setNeedRedirectTo()
      history.push('/newtrip/tripFirst')
    }
  }, [user])

  return (
    <Switch>
      <Route exact path="/">
        <MyTrips />
      </Route>
      <Route path="/signup/secondStep">
        <SignupSecondStep />
      </Route>
      <Route path="/signup/thirdStep">
        <SignupThirdStep />
      </Route>
      <Route path="/signup/fourthStep">
        <SignupFourthStep />
      </Route>
      <Route path="/signup/fifthStep">
        <SignupFifthStep />
      </Route>
      <Route path="/pwdreset">
        <PwdResetHandler />
      </Route>
      <Route path="/join/:tripId">
        <JoinTrip />
      </Route>
      <PrivateRoute path="/newtrip/tripFirst">
        <TripFirst />
      </PrivateRoute>
      <PrivateRoute path="/newtrip/tripSecond">
        <TripSecond />
      </PrivateRoute>
      <PrivateRoute path="/newtrip/tripThird">
        <TripThird />
      </PrivateRoute>
      <PrivateRoute path="/newtrip/tripFourth">
        <TripFourth />
      </PrivateRoute>
      <PrivateRoute path="/newtrip/tripFifth">
        <TripFifth />
      </PrivateRoute>
      <PrivateRoute path="/newtrip/tripRecap">
        <TripRecap />
      </PrivateRoute>
      <PrivateRoute path="/createtrip">
        <CreateTrip />
      </PrivateRoute>
      <PrivateRoute path="/tripPage/:tripId">
        <TripContextProvider>
          <TripPage>
            <TripGuide>
              <TripGuideItem path="/tripPage/:tripId/tripguide?itemName=:itemName" />
            </TripGuide>
          </TripPage>
        </TripContextProvider>
      </PrivateRoute>
      <PrivateRoute path="/profile">
        <Profile />
      </PrivateRoute>
      <PrivateRoute path="/account">
        <Account />
      </PrivateRoute>
      <PrivateRoute path="/settings">
        <Settings />
      </PrivateRoute>
      <PrivateRoute path="/help/:slug">
        <HelpDetails />
      </PrivateRoute>
      <PrivateRoute path="/help">
        <Help />
      </PrivateRoute>
      <Route path="*">
        <MyTrips />
      </Route>
    </Switch>
  )
}

export default Routes
