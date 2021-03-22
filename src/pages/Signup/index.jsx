import { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import LoaderButton from '../../components/LoaderButton';
import { useAppContext } from '../../context/AppContext';
import { formatErr } from '../../utils/errorUtil';

const initialState = {
  email: '',
  password: '',
  confirmPassword: '',
  confirmationCode: '',
}

const SignUp = () => {
  const [formData, setFormData] = useState(initialState);
  const [newUser, setNewUser] = useState(null);
  const { setAuthenticated, setMessageDisplay } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleOnChange = (e) => {
    try {
      const {name, value} = e.target;
      setFormData({
        ...formData,
        [name]: value,
      })
    } catch (err) {
      console.error(err);
    }
  }

  const handleOnSubmit = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      if (validateForm() && formData.password === formData.confirmPassword) {
        const {email, password} = formData;
        const newUser = await Auth.signUp({
          username: email,
          password,
        })
        setNewUser(newUser);
      }
    } catch (err) {
      console.error(err);
      const error = formatErr(err);
      setMessageDisplay(true, error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleConfirmationSubmit = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      if (validateForm()) {
        const {email, password, confirmationCode} = formData;
        await Auth.confirmSignUp(email, confirmationCode);
        await Auth.signIn(email, password);
        setAuthenticated(true);
        history.push('/');
      }
    } catch (err) {
      console.error(err);
      const error = formatErr(err);
      setMessageDisplay(true, error);
    } finally {
      setIsLoading(false);
    }
  }

  const validateForm = () => {
    const data = Object.assign({}, formData);
    delete data.confirmationCode;
    return Object.values(data).every(val => val);
  }

  const handleFormReset = () => {
    setFormData(initialState);
  }

  const { email, password, confirmPassword } = formData;
  return (
    <div className='column is-11-mobile is-half-tablet is-half-desktop is-half-widescreen is-half-fullhd'>
      <form className='form box'>
        {
          newUser ? (
          <ConfirmationForm handleOnChange={handleOnChange} formData={formData} />
          ) : (
          <>
            <div className='field'>
              <label htmlFor='email' className='label'>Email</label>
              <div className='control'>
                <input type='email' id='email' name='email' className='input' placeholder='john@doe.com' value={email}
                  onChange={handleOnChange} required autoFocus />
              </div>
            </div>
            <div className='field'>
              <label htmlFor='password' className='label'>Password</label>
              <div className='control'>
                <input type='password' id='password' name='password' className='input' placeholder='XXXXXXXXXXXX'
                  value={password} onChange={handleOnChange} required />
              </div>
            </div>
            <div className='field'>
              <label htmlFor='confirm-password' className='label'>Confirm Password</label>
              <div className='control'>
                <input type='password' id='confirm-password' name='confirmPassword' className='input'
                  placeholder='XXXXXXXXXXXX' value={confirmPassword} onChange={handleOnChange} required />
              </div>
            </div>
          </>
          )
        }
        <div className='field is-grouped'>
          <div className='control'>
            <LoaderButton classNames='button is-link' isLoading={isLoading} disabled={!validateForm()}
            clickHandler={newUser ? handleConfirmationSubmit: handleOnSubmit}>
              <span className={clsx(isLoading ? 'ml-2' : '')}>
                {
                  newUser ? 'Confirm Code' : 'Sign up'
                }
              </span>
            </LoaderButton>
          </div>
          <div className='control'>
            <button className='button is-danger is-light' onClick={handleFormReset}>
              <ion-icon name='refresh-outline'></ion-icon>
              <span>&nbsp;Reset</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

const ConfirmationForm = ({ handleOnChange, formData }) => {
  return (
    <div className='field'>
      <label htmlFor='confirm-password' className='label'>Confirm Code</label>
      <div className='control'>
        <input type='text' id='confirm-code' name='confirmationCode' className='input' 
        placeholder='123456' value={formData.confirmationCode} onChange={handleOnChange} required />
      </div>
    </div>
  )
}

ConfirmationForm.propTypes = {
  handleOnChange: PropTypes.func,
  formData: PropTypes.object.isRequired,
}

export default SignUp;
