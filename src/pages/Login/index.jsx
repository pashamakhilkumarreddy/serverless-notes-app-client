import { useState } from 'react';
import { Auth } from 'aws-amplify';
import clsx from 'clsx';
import { useAppContext } from '../../context/AppContext';
import LoaderButton from '../../components/LoaderButton';
import { formatErr } from '../../utils/errorUtil';

const initialState = {
  email: '',
  password: '',
}

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthenticated, setMessageDisplay } = useAppContext();

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
      if (validateForm()) {
        const {email, password} = formData;
        await Auth.signIn(email, password);
        setAuthenticated(true);
      }
    } catch (err) {
      console.error(err);
      const error = formatErr(err);
      setMessageDisplay(true, error);
    } finally {
      setIsLoading(false);
    }
  }

  const validateForm = () => Object.values(formData).every(val => val)

  const handleFormReset = () => {
    setFormData(initialState);
  }

  const {email, password} = formData;
  return (
    <div className='column is-11-mobile is-half-tablet is-half-desktop is-half-widescreen is-half-fullhd'>
      <form className='form box'>
        <div className='field'>
          <label htmlFor='email' className='label'>Email</label>
          <div className='control'>
            <input type='email' id='email' name='email' className='input' placeholder='Please enter an email'
              value={email} onChange={handleOnChange} required autoFocus />
          </div>
        </div>
        <div className='field'>
          <label htmlFor='password' className='label'>Password</label>
          <div className='control'>
            <input type='password' id='password' name='password' className='input'
              placeholder='Please enter an password' value={password} onChange={handleOnChange} required />
          </div>
        </div>
        <div className='field is-grouped'>
          <div className='control'>
            <LoaderButton className='button is-link' isLoading={isLoading} disabled={!validateForm()}
            clickHandler={handleOnSubmit}>
              <span className={clsx(isLoading ? 'ml-2' : '')}>Login</span>
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

export default Login;
