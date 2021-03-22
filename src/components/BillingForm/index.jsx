import { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { useAppContext } from '../../context/AppContext';
import LoaderButton from '../LoaderButton';
import { formatErr } from '../../utils/errorUtil';

const initialData = {
  name: '',
  storage: '',
}

const BillingForm = ({ isLoading, onSubmit, ...props }) => {
  const [formData, setFormData] = useState(initialData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const { setMessageDisplay } = useAppContext();

  isLoading = isProcessing || isLoading;

  const handleOnChange = async (e) => {
    try {
      const { name, value } = e.target;
      setFormData({
        [name]: value,
      });
    } catch (err) {
      console.error(err);
    }
  }

  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsProcessing(true);
      if (validateForm()) {
        const {token, error} = await props.stripe.createToken({
          name: formData.name,
        });
        onSubmit(e, formData.storage, {
          token, 
          error,
        });
      }
    } catch (err) {
      console.error(err);
      const error = formatErr(err);
      setMessageDisplay(true, error);
    } finally {
      setIsProcessing(false);
    }
  }

  const validateForm = () => Object.values(formData).every(val => val) && isCardComplete;

  const { storage, name } = formData;
  
  return (
    <form className='form box'>
      <div className='field'>
        <label htmlFor='storage'>Storage</label>
        <div className='control'>
          <input type='number' id='storage' name='storage' className='input' placeholder='Number of notes to save'
            value={storage} onChange={handleOnChange} required autoFocus />
        </div>
      </div>
      <div className='field'>
        <label htmlFor='name'>Cardholder&apos;s name</label>
        <div className='control'>
          <input type='text' id='name' name='name' className='input' placeholder='Name on the card' value={name}
            onChange={handleOnChange} required autoFocus />
        </div>
      </div>
      <div className='field'>
        <label htmlFor='storage'>Credit Card Info</label>
        <div className='control'>
          <CardElement className='card-field' onChange={e=> setIsCardComplete(e.complete)}
            style={{
              base: {
                fontSize: '1rem',
                color: '#495057',
                fontFamily: "'Open Sans', sans-serif",
              },
            }}/>
        </div>
      </div>
      <div className='field'>
        <div className='control'>
          <LoaderButton classNames='button is-primary' isLoading={isLoading} disabled={!validateForm()}
            clickHandler={handleOnSubmit}>
            <span className={clsx(isLoading ? 'ml-2' : '' )}>Purchase</span>
          </LoaderButton>
        </div>
      </div>
    </form>
  )
}

BillingForm.propTypes = {
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  props: PropTypes.any,
}

export default injectStripe(BillingForm);
