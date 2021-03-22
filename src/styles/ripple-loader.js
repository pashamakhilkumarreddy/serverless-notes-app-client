import styled from 'styled-components';

const RippleLoader = styled.div`
  & {
    display: inline-block;
    position: relative;
    width: ${props => props.width ? props.width : 80}px;
    height: ${props => props.height ? props.height : 80}px;
  }
  & div {
    position: absolute;
    border: 0.25rem solid #0b6eea;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  & div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 36px;
      left: 36px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 72px;
      height: 72px;
      opacity: 0;
    }
  }
`;

export default RippleLoader;