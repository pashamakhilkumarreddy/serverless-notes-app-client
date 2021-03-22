import { useRef, useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import clsx from 'clsx';
import { useHistory, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import LoaderButton from '../../components/LoaderButton';
import { formatErr } from '../../utils/errorUtil';
import config from '../../config';
import { uploadToS3 } from '../../utils/awsUtils';

const initialState = {
  content: '',
}

const Note = () => {
  const file = useRef(null);
  const [fileName, setFileName] = useState('');
  const [note, setNote] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setMessageDisplay } = useAppContext();
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const loadNote = () => {
      return API.get('notes', `/notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;
        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }
        setFormData({
          ...formData,
          content,
        });
        setNote(note);
      } catch (err) {
        console.error(err);
        const error = formatErr(err);
        setMessageDisplay(true, error);
      }
    }
    onLoad();
  }, [id]);

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
      let attachment;
      if (file.current && file.current.size && file.current.size > config.MAX_ATTACHMENT_SIZE) {
        setMessageDisplay(true, `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`);
        return;
      }
      if (file.current) {
        attachment = await uploadToS3(file.current);
      }
      await updateNote({ content: formData.content, attachment: attachment || note.attachment, });
      history.push('/');
    } catch (err) {
      console.error(err);
      const error = formatErr(err);
      setMessageDisplay(true, error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      const confirmed = window.confirm(`Are you sure you want to delete this note?`);
      if (!confirmed) {
        return;
      }
      setIsDeleting(true);
      await deletNote();
      history.push('/');
    } catch (err) {
      console.error(err);
      const error = formatErr(err);
      setMessageDisplay(true, error);
    } finally {
      setIsDeleting(false);
    }
  }

  const deletNote = () => {
    return API.del('notes', `/notes/${id}`);
  }

  const updateNote = (note) => {
    return API.put('notes', `/notes/${id}`, {
      body: note,
    });
  }

  const { content } = formData;
  return (
    <div className='column is-11-mobile is-half-tablet is-half-desktop is-half-widescreen is-half-fullhd'>
      {
        note ?
        (<form className='form box'>
        <div className='field'>
          <label htmlFor='content' className='label'>Content</label>
          <div className='control'>
            <textarea id='content' name='content' className='input' placeholder='Please enter the content'
              value={content} onChange={handleOnChange} required autoFocus />
          </div>
        </div>
        <div className='field'>
          <div className='title is-3'>Attachment</div>
          {
            note.attachment ? 
            (
              <>
                <p>
                  <a target='_blank' rel='noopener noreferrer' href={note.attachmentURL}>
                    {note.attachment}
                  </a>
                </p>
                <div className="field">
                  <figure className="image is-128x128" style={{ height: 'unset' }}>
                    <img id='note-thumb' src={note.attachmentURL} alt='' />
                  </figure>
                </div>
              </>
            ) : null
          }

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
              <span className={clsx(isLoading ? 'ml-2' : '')}>Update note</span>
            </LoaderButton>
          </div>
          <div className='control'>
            <LoaderButton classNames='button is-danger is-light' isLoading={isDeleting} 
            onClick={handleDelete}>
              <span className={clsx(isLoading ? 'ml-2' : '')}>Delete</span>
            </LoaderButton>
          </div>
        </div>
      </form>) : null
      }
    </div>
  )
}

export default Note;
