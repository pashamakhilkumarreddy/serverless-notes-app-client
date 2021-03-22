import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Notes = ({ notes = [] }) => {
  return (
    notes.map(({ noteId, content, createdAt }) =>
      <Link className='card m-2 column is-11-mobile is-5-tablet is-5-desktop is-5-widescreen is-5-fullhd' key={noteId}
      to={`/notes/${noteId}`}>
        <div className='card-content'>
          <div className='content'>
            <span className='title is-3'>
              {content.trim().split('\n')[0]}
            </span>
            <br /> <br />
            <time dateTime={createdAt}>{new Date(createdAt).toLocaleDateString()}</time>
          </div>
        </div>
      </Link>
    )
  );
}

Notes.propTypes = {
  notes: PropTypes.array.isRequired,
}

export default Notes;
