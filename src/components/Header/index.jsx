import { useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import { PageHeader } from '../../styles';
import { useAppContext } from '../../context/AppContext';

const Header = () => {
  const [showHeader, setHeader] = useState(false);
  const { isAuthenticated, setAuthenticated } = useAppContext();
  const history = useHistory();

  const handleLogout = async (e) => {
    try {
      await Auth.signOut();
      setAuthenticated(false);
      history.push('/login');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <PageHeader>
      <nav className='navbar' role='navigation' aria-label='main navigation'>
        <div className='navbar-brand'>
          <Link to='/' className='navbar-item'>
            <img src='' alt='Logo' decoding='async' loading='lazy' />
          </Link>

          <span role='button' className='navbar-burger' aria-label='menu' aria-expanded='false'
            data-target='main-navbar' onClick={()=> setHeader(!showHeader)}>
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
          </span>
        </div>

        <div id='main-navbar' className='navbar-menu'>
          <div className='navbar-start'>
            <Link to='/' className='navbar-item'>
            Home
            </Link>
          </div>
          <div className='navbar-end'>
            <div className='navbar-item'>
              <div className='buttons'>
                {
                isAuthenticated ?
                (
                <>
                  <NavLink to='/settings' className='button is-primary is-light'>
                    Settings
                  </NavLink>
                  <button className='button is-danger is-light' onClick={handleLogout}>
                    <ion-icon name='log-out-outline'></ion-icon>
                    <span>&nbsp;Log out</span>
                  </button>
                </>
                ) : (
                <>
                  <Link to='/signup' className='button is-primary'>
                  <strong>Sign up</strong>
                  </Link>
                  <Link to='/login' className='button is-primary is-light'>
                    <ion-icon name='log-in-outline'></ion-icon>
                    <span>&nbsp;Login</span>
                  </Link>
                </>
                )
                }
              </div>
            </div>
          </div>
        </div>
      </nav>
    </PageHeader>
  )
}

export default Header;
