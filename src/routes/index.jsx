import { lazy, Suspense } from 'react';
import {Route, Switch} from 'react-router-dom';
import AuthenticatedRoute from '../components/AuthenticatedRoute';
import ErrorBoundary from '../components/ErrorBoundary';
import PageLoader from '../components/PageLoader';
import UnAuthenticatedRoute from '../components/UnAuthenticatedRoute';
import Home from '../pages/Home';
import Note from '../pages/Note';
import Settings from '../pages/Settings';

const SignUp = lazy(() => import('../pages/Signup'));
const Login = lazy(() => import('../pages/Login'));
const NewNote = lazy(() => import('../pages/NewNote'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));

const Routes = () => 
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={['/', '/home', '/index']} exact>
          <Home />
        </Route>
        <UnAuthenticatedRoute path='/signup' exact>
          <SignUp />
        </UnAuthenticatedRoute>
        <UnAuthenticatedRoute  path='/login' exact >
          <Login />
        </UnAuthenticatedRoute>
        <AuthenticatedRoute path='/notes/new' exact>
          <NewNote />
        </AuthenticatedRoute>
        <AuthenticatedRoute path='/notes/:id' exact>
          <Note />
        </AuthenticatedRoute>
        <AuthenticatedRoute path='/settings' exact>
          <Settings />
        </AuthenticatedRoute>
        <Route path='*' component={PageNotFound} exact />
      </Switch>
    </Suspense>
  </ErrorBoundary>

export default Routes;
