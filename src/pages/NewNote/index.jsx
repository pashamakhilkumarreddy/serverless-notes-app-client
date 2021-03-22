import { useRef, useState } from 'react';
import { API } from 'aws-amplify';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import LoaderButton from '../../components/LoaderButton';
import { formatErr } from '../../utils/errorUtil';
import config from '../../config';
import { uploadToS3 } from '../../utils/awsUtils';

const initialState = {
  content: '',
}

const NewNote = () => {
  const file = useRef(null);
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { setMessageDisplay } = useAppContext();
  const history = useHistory();

  const handleFileChange = (e) => {
    try {
      file.current = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        document.querySelector('#image-thumb').setAttribute('src', e.target.result);
      }
      reader.readAsDataURL(file.current);
      setFileName(file.current ? file.current.name: '');
    } catch (err) {
      console.error(err);
    }
  }

  const handleOnChange = (e) => {
    try {
      const {name, value} = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    } catch (err) {
      console.error(err);
    }
  }

  const handleOnSubmit = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      if (file.current && file.current.size && file.current.size > config.MAX_ATTACHMENT_SIZE) {
        setMessageDisplay(true, `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`);
        return;
      }
      const attachment = file.current ? await uploadToS3(file.current) : null;
      await createNote({ content: formData.content, attachment, });
      history.push('/');
    } catch (err) {
      console.error(err);
      const error = formatErr(err);
      setMessageDisplay(true, error);
    } finally {
      setIsLoading(false);
    }
  }

  const createNote = (note) => {
    return API.post('notes', '/notes', {
      body: note,
    });
  }

  const handleFormReset = () => {
    setFormData(initialState);
    file.current = null;
    setFileName('');
  }

  const { content } = formData;
  return (
    <div className='column is-11-mobile is-half-tablet is-half-desktop is-half-widescreen is-half-fullhd'>
      <form className='form box'>
        <div className='field'>
          <label htmlFor='content' className='label'>Content</label>
          <div className='control'>
            <textarea id='content' name='content' className='input' placeholder='Please enter the content'
              value={content} onChange={handleOnChange} required autoFocus />
          </div>
        </div>
        <div className='field'>
          <div className='file has-name'>
            <label className='file-label'>
              <input type='file' name='file' className='file-input' onChange={handleFileChange} />
              <span className='file-cta'>
                <span className='file-icon'>
                  <i className='fas fa-upload'></i>
                </span>
                <span className='file-label'>
                  Choose a file...
                </span>
              </span>
              {
                fileName ?  (<span className='file-name'>{fileName}</span>) : null
              }
            </label>
          </div>
        </div>
        {
          file.current ? 
          (<div className="field">
          <figure className="image is-128x128" style={{ height: 'unset' }}>
            <img id='image-thumb' src='#' alt='' />
          </figure>
        </div>) : null
        }
      
        <div className='field is-grouped'>
          <div className='control'>
            <LoaderButton className='button is-link' isLoading={isLoading} disabled={!formData.content}
            clickHandler={handleOnSubmit}>
              <span className={clsx(isLoading ? 'ml-2' : '')}>Add note</span>
            </LoaderButton>
          </div>
          <div className='control'>
            <button className='button is-danger is-light' onClick={handleFormReset}>Reset</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewNote;
