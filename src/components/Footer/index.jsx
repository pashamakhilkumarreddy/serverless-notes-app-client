import { memo } from 'react';
import { PageFooter } from '../../styles';

const Footer = () => {
  return (
    <PageFooter className='footer'>
      <div className='content has-text-centered'>
        <p className='title is-4 has-text-weight-bold'>
          &copy; React Node Serverless
        </p>
      </div>
    </PageFooter>
  )
}

export default memo(Footer);
