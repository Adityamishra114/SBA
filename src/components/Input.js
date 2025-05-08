const Input = ({ type, placeholder,name, value, onChange }) => (
  <input
    type={type}
    name={name} 
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required
  />
);

export default Input;
