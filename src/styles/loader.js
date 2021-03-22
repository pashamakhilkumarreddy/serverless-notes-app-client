import styled from 'styled-components';

const Loader = styled.div`
  & {
    display: inline-block;
    width: ${props => props.width}px;
    height: ${props => props.width}px;
  }
  &:after {
    content: ' ';
    display: block;
    width: ${props => props.width}px;
    height: ${props => props.width}px;
    margin: ${props => props.width / 5};
    border-radius: 50%;
    border: 0.25rem solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;