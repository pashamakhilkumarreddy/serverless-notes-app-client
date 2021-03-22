import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import Footer from './components/Footer';
import Header from './components/Header';
import Routes from './routes';
import { AppContext } from './context/AppContext';
import { formatErr } from './utils/errorUtil';
import clsx from 'clsx';

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [showMessage, setshowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const setMessageDisplay = (showMessage, message, type = 'danger') => {
    try {
      setshowMessage(showMessage);
      setMessage(message);
      setMessageType(getMessageType(type));
      setTimeout(() => {
        setshowMessage(false);
        setMessage('');
      }, 4200);
    } catch (err) {
      console.error(err);
    }
  }

  const getMessageType = (type) => {
    const messageTypes = {
      'primary': 'is-primary',
      'link': 'is-link',
      'info': 'is-info',
      'success': 'is-success',
      'warning': 'is-warning',
      'danger': 'is-danger',
    }
    return messageTypes[type];
  }

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      setAuthenticated(true);
    } catch (err) {
      console.error(err);
      const error = formatErr(err);
      setMessageDisplay(true, error);
    } finally {
      setIsAuthenticating(false);
    }
  }

  const removeNotification = () => {
    setshowMessage(false);
    setMessage('');
  }
  
  const context = { isAuthenticated, setAuthenticated, setMessageDisplay }

  return (
    <>
      <AppContext.Provider value={context}>
        {
          !isAuthenticating ? 
          (<>
          <Header />
          <ErrToast showMessage={showMessage} message={message} 
          messageType={messageType} removeNotification={removeNotification} />
          <main className='container mt-6'>
            <div className='columns is-1 is-multiline is-mobile is-centered is-vcentered'>
              <Routes />
            </div>
          </main>
          <Footer />
          </>) : null
        }
      </AppContext.Provider>
    </>
  );
}

const ErrToast = ({ showMessage, message, messageType , removeNotification}) => {
  return (
    (showMessage && message) ?
    (<div className="columns is-mobile is-justify-content-flex-end is-vcentered error">
      <div className="column is-12-mobile is-half-tablet is-4-desktop is-3-widescreen is-3-fullhd">
        <div className={clsx('notification',  'is-light', messageType)}>
          <button className="delete" onClick={removeNotification}></button>
          {
          message
          }
        </div>
      </div>
    </div>) : null
  )
}

ErrToast.propTypes = {
  showMessage: PropTypes.bool,
  message: PropTypes.string,
  messageType: PropTypes.string,
  removeNotification: PropTypes.func,
}

export default App;
