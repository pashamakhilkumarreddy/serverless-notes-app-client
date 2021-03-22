import clsx from 'clsx';
import PropTypes from 'prop-types';
import { memo } from 'react';
import Loader from '../Loader';

const LoaderButton = ({
  isLoading,
  classNames='',
  disabled = false,
  clickHandler=() => {},
  ...props
}) => {
  return (
    <button className={clsx('loader-button', classNames)} onClick={clickHandler}
    disabled={disabled || isLoading} {...props}>
    {
      isLoading ? <Loader width={20} height={20} /> : null
    }
    {props.children}
  </button>
  )
}

LoaderButton.propTypes = {
  isLoading: PropTypes.bool,
  classNames: PropTypes.string,
  disabled: PropTypes.bool,
}

export default memo(LoaderButton);