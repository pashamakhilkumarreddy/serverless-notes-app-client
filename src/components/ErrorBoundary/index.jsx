import { Component } from 'react';
import ErrorImg from '../../assets/images/Error.gif';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: true,
    }
  }

  static getDerivedStateFromError(error) {
    console.error(error);
    return {
      hasError: true,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      <Error />
    }
    return this.props.children;
  }
}

const Error = () => {
  return (
    <div className='column is-11-mobile is-11-tablet is-10-desktop is-10-widescreen is-10-fullhd'>
      <figure className='image is-square'>
        <img src={ErrorImg} alt='Error' loading='eager' decoding='sync' />
      </figure>
    </div>
  )
}

export default ErrorBoundary;
