import { TextField, MenuItem } from "@mui/material";

const CustomSelect = ({
    label,
    value,
    onChange,
    options = [],
    getOptionLabel = (option) => option.label,
    getOptionValue = (option) => option.value,
    emptyOptionLabel = "Selecciona una opción",
    fullWidth = false,
    size = "small",
    sx = {},
    fontSize="0.9rem",
    ...props
}) => {
    return (
        <TextField
            select
            label={label}
            value={value}
            onChange={onChange}
            size={size}
            fullWidth={fullWidth}
            InputProps={{
                sx: { fontSize }
            }}
            InputLabelProps={{
                sx: { fontSize }
            }}
            sx={{
                minWidth: 180,
                "& .MuiOutlinedInput-root": {
                    borderRadius: "10px"
                },
                ...sx
            }}
            {...props}
        >
            <MenuItem value="">
                <em>{emptyOptionLabel}</em>
            </MenuItem>

            {options.map((option) => {
                const optionValue = getOptionValue(option);
                return (
                    <MenuItem key={optionValue} value={optionValue} sx={{ fontSize }}>
                        {getOptionLabel(option)}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default CustomSelect;