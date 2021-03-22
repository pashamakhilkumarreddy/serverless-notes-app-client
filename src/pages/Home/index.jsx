import API from '@aws-amplify/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Notes from '../../components/Notes';
import { useAppContext } from '../../context/AppContext';
import { formatErr } from '../../utils/errorUtil';
import Loader from '../../components/PageLoader';

const Home = () => {

  const { isAuthenticated, setMessageDisplay } = useAppContext();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function onLoad() {
      try {
        if (!isAuthenticated) {
          return;
        }
        setIsLoading(true);
        const notes = await loadNotes();
        setNotes(notes);
      } catch (err) {
        console.error(err);
        const error = formatErr(err);
        setMessageDisplay(true, error);
      } finally {
        setIsLoading(false);
      }
    }
    onLoad();
  }, [isAuthenticated]);

  const loadNotes = () => {
    return API.get('notes', '/notes');
  }

  return (
    <>
      <div className='column is-full has-text-centered'>
        <Link to='/notes/new' className='button is-link'>
          <ion-icon name='add-outline'></ion-icon>
          <span className='has-text-weight-bold'>&nbsp;Create a new note</span>
        </Link>
      </div>
      {
        isLoading ? <Loader /> : <Notes notes={notes} />
      }
    </>
  )
}

export default Home;
