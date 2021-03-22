import PropTypes from 'prop-types';
import { memo } from 'react';
import { RippleLoader } from '../../styles';

const PageLoader = ({ width = 80, height = 80 }) => {
  return (
    <RippleLoader width={width} height={height}>
      <div></div>
      <div></div>
    </RippleLoader>
  );
}

PageLoader.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}

export default memo(PageLoader);
