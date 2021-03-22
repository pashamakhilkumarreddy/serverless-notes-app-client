import { Route, Redirect } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const queryString = (name, url = window.location.href) => {
  name = name.replace(/[[]]/g, '\\$&');

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i');
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ''));
}

const UnAuthenticatedRoute = ({ children, ...rest }) => {
  const { isAuthenticated } = useAppContext();
  const redirect = queryString('redirect');
  return (
    <Route {...rest}>
      {
        !isAuthenticated ? (
          children
        ) : (
          <Redirect to={
            redirect === '' || redirect === null ? '/' : redirect
          } />
        )
      }
    </Route>
  );
}

export default UnAuthenticatedRoute;
