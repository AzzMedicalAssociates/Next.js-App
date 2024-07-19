import { memo } from "react";

const Input = ({ type, value, placeholder, onChange, ...rest }) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      {...rest}
    />
  );
};

export default memo(Input);
