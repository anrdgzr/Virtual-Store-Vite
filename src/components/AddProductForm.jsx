import { useEffect, useState } from "react";
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
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { api } from "../network/api";
import imageCompression from 'browser-image-compression';
import { notify } from "../utils/notify";

// const API_URL = process.env.REACT_APP_API_URL;
// const API_URL = process.env.REACT_APP_API_URL;

const AddProductForm = () => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagenes, setImagenes] = useState([]);
    const [sabores, setSabores] = useState([{ nombre: "", cantidad: 0 }]);
    const [isStar, setIsStar] = useState(false);
    const [marca, setMarca] = useState("");
    const [storedBrands, setStoredBrands] = useState([]);
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImagenes((prev) => [...prev, ...files]);
    };

    const handleDeleteImage = (index) => {
        setImagenes((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSaborChange = (idx, field, value) => {
        const nuevosSabores = [...sabores];
        nuevosSabores[idx][field] = field === "cantidad" ? Number(value) : value;
        setSabores(nuevosSabores);
    };

    const handleAddSabor = () => {
        setSabores([...sabores, { nombre: "", cantidad: 0 }]);
    };

    const handleRemoveSabor = (idx) => {
        setSabores(sabores.filter((_, i) => i !== idx));
    };

    const handleTogglestar = () => {
        setIsStar((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("folder", "products");

            formData.append("nombre", nombre);
            formData.append("descripcion", descripcion);
            formData.append("precio", Number(precio));
            formData.append("sabores", JSON.stringify(sabores.filter(s => s.nombre !== "")));
            formData.append("star", isStar);
            formData.append("marca", marca);

            const compressionOptions = {
                maxSizeMB: 1.0,
                maxWidthOrHeight: 1080,
                useWebWorker: true,
            };

            for (const img of imagenes) {
                try {
                    const compressedFile = await imageCompression(img, compressionOptions);
                    formData.append("imagenes", compressedFile);
                } catch (error) {
                    console.error("Error comprimiendo imagen:", error);
                    formData.append("imagenes", img); 
                }
            }

            await api.post("/api/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            notify.success("Producto creado con éxito");

            setNombre("");
            setDescripcion("");
            setPrecio("");
            setImagenes([]);
            setSabores([{ nombre: "", cantidad: 0 }])
        } catch (error) {
            console.error("Error creando producto", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await api.get("/api/brands");
            setStoredBrands(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchBrands();
    }, [])

    return (
        <Box
            sx={{
                maxWidth: { xs: "90%", sm: "80%" },
                margin: "auto",
                padding: 1,
            }}
        >
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
                <Typography variant="h5" mb={3} textAlign="center">
                    Agregar Nuevo Producto
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                            {/* <TextField
                                label="Marca"
                                multiline
                                value={marca}
                                onChange={(e) => setMarca(e.target.value)}
                                required
                                sx={{width: isSmall ? "100%" : "250px"}}
                            /> */}
                            <FormControl fullWidth sx={{ width: isSmall ? "100%" : "250px" }}>
                                <InputLabel id="marca-label">Marca</InputLabel>
                                <Select
                                    labelId="marca-label"
                                    label="Marca"
                                    value={marca}
                                    onChange={(e) => setMarca(e.target.value)}
                                    required
                                >
                                    {storedBrands.map((m, idx) => (
                                        <MenuItem key={idx} value={m.marca}>
                                            {m.marca}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Descripción"
                                fullWidth
                                multiline
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                            <TextField
                                label="Precio"
                                type="number"
                                width="200px"
                                value={precio}
                                prefix="$"
                                onChange={(e) => setPrecio(e.target.value)}
                                required
                            />
                        </Stack>
                        <Stack direction="column" spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="h6">Sabores</Typography>
                                <Tooltip title="Agregar sabor">
                                    <IconButton color="success" onClick={handleAddSabor}>
                                        <AddCircleIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Agregar Imágenes del producto">
                                    <input
                                        accept="image/*"
                                        type="file"
                                        multiple
                                        id="upload-image"
                                        style={{ display: "none" }}
                                        onChange={handleImageChange}
                                    />

                                    <label htmlFor="upload-image">
                                        <IconButton component="span" sx={{ color: "#87CEEB" }}>
                                            <PhotoLibraryIcon />
                                        </IconButton>
                                    </label>
                                </Tooltip>
                                <Tooltip title="Es Producto Estrella">
                                    <IconButton onClick={handleTogglestar} sx={{ color: "#FFC201" }}>
                                        {isStar ? (
                                            <StarIcon />
                                        ) : (
                                            <StarBorderIcon />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                            <Stack direction="column" spacing={1}>
                                {sabores.map((sabor, idx) => (
                                    <Stack direction="row" key={idx} alignItems="center">
                                        <TextField
                                            label={isSmall ? "Sabor" : "Nombre del sabor" }
                                            value={sabor.nombre}
                                            onChange={(e) => handleSaborChange(idx, "nombre", e.target.value)}
                                            required
                                            fullWidth
                                            multiline={isSmall ? true : false}
                                            sx={{mr: 1}}
                                        />
                                        <TextField
                                            label="Cantidad"
                                            type="number"
                                            value={sabor.cantidad}
                                            onChange={(e) => handleSaborChange(idx, "cantidad", e.target.value)}
                                            required
                                            sx={{ width: 130, mr: 1 }}
                                        />
                                        <IconButton color="error" onClick={() => handleRemoveSabor(idx)} sx={{p: 0}}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </Stack>
                        </Stack>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                                mt: 2,
                            }}
                        >
                            {imagenes.map((file, idx) => (
                                <Box
                                    key={idx}
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
                                        alt={`preview-${idx}`}
                                        sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteImage(idx)}
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
                            ))}
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                                sx={{ mt: 2, position: "relative" }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                                ) : (
                                    "Subir Producto"
                                )}
                            </Button>
                        </Grid>
                    </Stack>
                </form>
            </Paper>
        </Box>
  );
}

export default AddProductForm;