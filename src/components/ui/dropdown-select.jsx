import Select, { components } from "react-select";

const DropDownSelect = ({
  options,
  onChange,
  placeholder,
  components,
  styles,
  ...rest
}) => {
  const customStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      width: 310,
      height: 50,
      border: "2px solid #1E328F",
      "&:hover": {
        border: "2px solid #1E328F",
        cursor: "pointer",
      },
    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      "&:hover": { cursor: "pointer" },
      maxHeight: "160px",
    }),
    dropdownIndicator: (baseStyles, state) => ({
      ...baseStyles,
      color: "#1E328F",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? "rgba(13,50,118,1)" : "white",
      "&:hover": {
        backgroundColor: "#1E328F",
        cursor: "pointer",
        color: "white",
      },
    }),
  };

  return (
    <Select
      components={components}
      styles={{ ...customStyles, ...styles }}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      createOptionPosition="first"
      {...rest}
    />
  );
};

export const specificCustomStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    width: "310",
    paddingTop: "4px",
    marginTop: "1px",
    disply: "flex items-center justify-center",
    border: "1px solid #1E328F",
    borderRadius: "8px",
    "&:hover": {
      border: "1px solid #1E328F",
      cursor: "pointer",
    },
  }),
};

export default DropDownSelect;
