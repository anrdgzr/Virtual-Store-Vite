import { TextField } from "@mui/material";

const CustomTextField = ({
  label,
  value,
  onChange,
  fontSize = "0.9rem",
  ...props
}) => {
    const shrink = Boolean(value);

    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
                shrink,
                sx: {
                    fontSize,
                }
            }}
            InputProps={{
                sx: {
                    fontSize,
                }
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    border: "2px solid #000",
                    backgroundColor: "#f4f5f7",
                    transition: "all 0.2s ease",

                    "& fieldset": {
                        border: "none"
                    },

                    "&:hover": {
                        backgroundColor: "#fff"
                    },

                    "&.Mui-focused": {
                        backgroundColor: "#fff",
                        boxShadow: "4px 4px 0px #000"
                    }
                }
            }}
            {...props}
        />
    );
};

export default CustomTextField;