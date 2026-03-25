import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { api } from "../network/api";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { notify } from "../utils/notify";

const AddBrandForm = () => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const [marcas2Add, setMarcas2Add] = useState([{ marca: "", imagenes: [], star: false, color: "#000000" }]);

    const handleAddMarca = () => {
        setMarcas2Add([...marcas2Add, { marca: "", imagenes: [], star: false, color: "#000000" }]);
    };

    const handleToggleStar = (idx) => {
        const updated = [...marcas2Add];
        updated[idx].star = !updated[idx].star;
        setMarcas2Add(updated);
    };

    const handleMarcasFieldChange = (idx, field, value) => {
        const updated = [...marcas2Add];
        if (field === "imagenes") {
            updated[idx][field] = [...updated[idx][field], ...value];
        } else {
            updated[idx][field] = value;
        }
        setMarcas2Add(updated);
    };

    const handleDeleteImage = (idx, index) => {
        const updated = [...marcas2Add];
        updated[idx].imagenes.splice(index, 1);
        setMarcas2Add(updated);
    };

    const handleRemoveMarca = (idx) => {
        setMarcas2Add(marcas2Add.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("folder", "brands");

            formData.append("marcas", JSON.stringify(
                marcas2Add.map(m => ({ marca: m.marca, star: m.star, color: m.color }))
            ));
            marcas2Add.forEach((m, idx) => {
                Array.from(m.imagenes).forEach(file => {
                    formData.append(`file_${idx}`, file);
                });
            });

            const res = await api.post("/api/brands", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if(res.data){
                notify.success("Marcas subidas con éxito")
            }
            console.log("Respuesta del servidor:", res.data);

            setMarcas2Add([{marca: "", imagenes: [], star: false, color: "#000000" }])
        } catch (err) {
            console.error("Error subiendo marcas:", err);
            notify.error("Error subiendo marcas");
        }
    };

    return (
        <Box
            sx={{
                maxWidth: { xs: "95%", sm: "85%" },
                margin: "auto",
                padding: 1,
            }}
        >
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
                <Typography variant="h5" mb={3} textAlign="center">
                    Agregar Marca(s)
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack direction={"column"} spacing={2}>
                        {marcas2Add.map((m, idx) => (
                            <Stack key={idx} spacing={2}>
                                <Stack direction={"row"} alignItems="center" spacing={1}>
                                    <TextField
                                        label="Marca... "
                                        value={m.marca}
                                        onChange={(e) => handleMarcasFieldChange(idx, "marca", e.target.value)}
                                        required
                                        width={isSmall ? "50%" : "100%"}
                                        fullWidth={isSmall ? false : true}
                                    />

                                    <Tooltip title="Agregar Imágenes de la marca">
                                        <input
                                            accept=".jpg,.jpeg,.png,.webp,.svg"
                                            type="file"
                                            multiple
                                            id={`upload-image-${idx}`}
                                            style={{ display: "none" }}
                                            onChange={(e) => handleMarcasFieldChange(idx, "imagenes", e.target.files)}
                                        />
                                        <label htmlFor={`upload-image-${idx}`}>
                                            <IconButton component="span" sx={{ color: "#87CEEB" }}>
                                                <PhotoLibraryIcon />
                                            </IconButton>
                                        </label>
                                    </Tooltip>

                                    <Tooltip title="Marca Estelar">
                                        <IconButton onClick={() => handleToggleStar(idx)} sx={{ color: "#FFC201" }}>
                                        {m.star ? <StarIcon /> : <StarBorderIcon />}
                                        </IconButton>
                                    </Tooltip>

                                    <IconButton color="error" onClick={() => handleRemoveMarca(idx)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>

                                <TextField
                                    label="Color Hex"
                                    value={m.color}
                                    onChange={(e) => handleMarcasFieldChange(idx, "color", e.target.value)}
                                    required
                                    fullWidth={isSmall}
                                    sx={{ width: { sm: "200px" } }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <input
                                                    type="color"
                                                    value={m.color || "#000000"}
                                                    onChange={(e) => handleMarcasFieldChange(idx, "color", e.target.value)}
                                                    list={`suggested-colors-${idx}`}
                                                    style={{
                                                        border: 'none',
                                                        padding: 0,
                                                        width: '28px',
                                                        height: '28px',
                                                        cursor: 'pointer',
                                                        background: 'none',
                                                    }}
                                                />
                                                <datalist id={`suggested-colors-${idx}`}>
                                                    <option value="#8A36D2">Morado</option>
                                                    <option value="#D6FF00">Amarillo Ácido</option>
                                                    <option value="#FF3366">Rosa Neón</option>
                                                    <option value="#00E5FF">Cian</option>
                                                    <option value="#000000">Negro</option>
                                                </datalist>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Grid container spacing={1}>
                                    {m.imagenes.map((file, index) => (
                                        <Grid item key={index}>
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                    boxShadow: 2,
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={URL.createObjectURL(file)}
                                                    alt={`preview-${index}`}
                                                    sx={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteImage(idx, index)}
                                                    sx={{
                                                        position: "absolute",
                                                        top: 2,
                                                        right: 2,
                                                        bgcolor: "white",
                                                        "&:hover": { bgcolor: "grey.200" },
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                        ))}
                        <Grid container spacing={2} justifyContent="flex-start" >
                            <Tooltip title="Agregar marca">
                                <IconButton color="success" onClick={handleAddMarca} size="small">
                                    <AddCircleIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Subir Marca(s)
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default AddBrandForm;
