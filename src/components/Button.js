import styled from "styled-components";

const Button = styled.button`
  padding: 10px 16px;
  border: 1px solid #222;
  background-color: #fff;
  color: #222;
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 14px;
  opacity: ${(props) => (props.disabled ? 0.4 : null)};
  text-transform: uppercase;
`;

export default Button;
