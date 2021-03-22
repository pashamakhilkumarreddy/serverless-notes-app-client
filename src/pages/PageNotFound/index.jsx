import { memo } from 'react';
import { Link } from 'react-router-dom';
import PGNFImage from '../../assets/images/PageNotFound.jpg';

const PageNotFound = () => {
  return (
    <div className='column is-11-mobile is-11-tablet is-10-desktop is-10-widescreen is-10-fullhd'>
      <Link to='/' className='button is-info is-light mb-3'>
        <ion-icon name='arrow-back-outline'></ion-icon>
        <span>&nbsp;Back to Home</span>
      </Link>
      <figure className='image is-square'>
        <img src={PGNFImage} alt='Page Not Found' loading='eager' decoding='sync' />
      </figure>
    </div>
  )
}

export default memo(PageNotFound);
