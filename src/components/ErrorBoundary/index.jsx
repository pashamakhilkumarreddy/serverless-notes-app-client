import { Component } from 'react';
import { logError } from '../../utils/errorUtil';
import ErrorImg from '../../assets/images/Error.gif';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    console.error(error);
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Error />;
    }
    return this.props.children;
  }
}

const Error = () => {
  return (
    <div className='column is-11-mobile is-11-tablet is-10-desktop is-10-widescreen is-10-fullhd'>
      <h2 className='title is-2 has-text-centered'>
        Something went wrong! It is not you it could be us. <br />
        Our best minds are on it.
      </h2>
      <figure className='image is-square'>
        <img src={ErrorImg} alt='Error' loading='eager' decoding='sync' />
      </figure>
    </div>
  );
};

export default ErrorBoundary;
