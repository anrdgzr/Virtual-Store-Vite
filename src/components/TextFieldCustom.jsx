import { Box, Typography, TextField } from "@mui/material";

const TextFieldCustom = ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    required = false, 
    ...props 
}) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography 
                component="label" 
                fontWeight="900" 
                textTransform="uppercase" 
                fontSize="0.85rem"
                color="#000"
            >
                {label} {required && <span style={{ color: "#FF3366" }}>*</span>}
            </Typography>
            
            <TextField
                fullWidth
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                variant="outlined"
                hiddenLabel
                {...props}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        border: "3px solid #000",
                        boxShadow: "4px 4px 0px #000",
                        transition: "all 0.2s ease",
                        
                        "& fieldset": { border: "none" }, 
                        
                        "&:hover": {
                            transform: "translate(-2px, -2px)",
                            boxShadow: "6px 6px 0px #000",
                        },
                        "&.Mui-focused": {
                            backgroundColor: "#fff",
                            transform: "translate(-2px, -2px)",
                            boxShadow: "6px 6px 0px #00E5FF", 
                        }
                    },
                    "& .MuiInputBase-input": {
                        fontWeight: "bold",
                        padding: "14px",
                    },
                    ...props.sx 
                }}
            />
        </Box>
    );
};

export default TextFieldCustom;