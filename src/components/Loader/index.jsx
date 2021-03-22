import { memo } from 'react';
import PropTypes from 'prop-types';
import { Loader as RingLoader } from '../../styles';

const Loader = ({ width = 80, height = 80 }) => <RingLoader width={width} height={height} />

Loader.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}

export default memo(Loader);
