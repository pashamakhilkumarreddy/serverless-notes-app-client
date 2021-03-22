import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import API from '@aws-amplify/api';
import { Elements, StripeProvider } from 'react-stripe-elements';
import config from '../../config';
import { formatErr } from '../../utils/errorUtil';
import BillingForm from '../../components/BillingForm';
import { useAppContext } from '../../context/AppContext';

const Settings = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState(null);
  const { setMessageDisplay } = useAppContext();

  useEffect(() => {
    setStripe(window.Stripe(config.STRIPE_KEY));
  }, []);

  const handleOnSubmit = async (e, storage, { token, error }) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (error) {
        const err = formatErr(error);
        setMessageDisplay(true, err);
        return;
      }
      await billUser({
        storage,
        source: token.id,
      });
      setMessageDisplay(true, 'Your card has been charged successfully', 'success');
      history.push('/');
    } catch (err) {
      console.error(err);
      const error = formatErr(err);
      setMessageDisplay(true, error);
    } finally {
      setIsLoading(false);
    }
  }

  const billUser = (details) => {
    return API.post('notes', '/billing', {
      body: details,
    });
  }
  return (
    <div className='settings column is-11-mobile is-half-tablet is-half-desktop is-half-widescreen is-half-fullhd'>
      <StripeProvider stripe={stripe}>
        <Elements fonts={[{ cssSrc: "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800" , },]}>
          <BillingForm isLoading={isLoading} onSubmit={handleOnSubmit} />
        </Elements>
      </StripeProvider>
    </div>
  )
}

export default Settings;
