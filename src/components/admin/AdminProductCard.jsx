import { useState } from "react";
import { Box, Typography, Stack, Card, CardMedia, CardContent, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { api } from "../../network/api";
import { notify } from "../../utils/notify";

const AdminProductCard = ({ producto, refreshProducts }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const [editData, setEditData] = useState({ ...producto });
    const [existingImages, setExistingImages] = useState([...producto.imagenes]);
    const [newImages, setNewImages] = useState([]);

    const handleDeleteProduct = async () => {
        if (window.confirm(`¿Estás seguro de eliminar ${producto.nombre}? Esto no se puede deshacer.`)) {
            try {
                const productId = producto._id || producto.id;
                await api.delete(`/api/products/${productId}`);
                notify.success("Producto eliminado")

                refreshProducts();
            } catch (err) {
                console.error(err);
                notify.error("Error eliminando producto")
            }
        }
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleFlavorChange = (idx, field, value) => {
        const updatedSabores = [...editData.sabores];
        updatedSabores[idx][field] = value;
        setEditData({ ...editData, sabores: updatedSabores });
    };

    const handleRemoveExistingImage = (indexToRemove) => {
        setExistingImages(existingImages.filter((_, idx) => idx !== indexToRemove));
    };

    const handleAddNewImages = (e) => {
        const files = Array.from(e.target.files);
        setNewImages((prevImages) => [...prevImages, ...files]);
    };

    const handleRemoveNewImage = (indexToRemove) => {
        setNewImages(newImages.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("nombre", editData.nombre);
            formData.append("descripcion", editData.descripcion);
            formData.append("precio", Number(editData.precio));
            formData.append("marca", editData.marca);
            formData.append("star", editData.star);
            formData.append("sabores", JSON.stringify(editData.sabores));
            formData.append("existingImages", JSON.stringify(existingImages));

            Array.from(newImages).forEach((file) => {
                formData.append("newImages", file);
            });
            const productId = producto._id || producto.id;
            await api.put(`/api/products/${productId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            notify.success("Producto actualizado")

            setOpenEdit(false);
            refreshProducts();
        } catch (err) {
            console.error(err);
            notify.error("Error actualizando Producto")
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card 
                sx={{ 
                    minWidth: 320,
                    maxWidth: 320, 
                    flexShrink: 0,
                    display: "flex", flexDirection: "column", 
                    border: "3px solid #000", borderRadius: "12px", 
                    boxShadow: "6px 6px 0px #000", position: "relative",
                    transition: "transform 0.2s", "&:hover": { transform: "translate(-2px, -2px)", boxShadow: "8px 8px 0px #000" }
                }}
            >
                {producto.star && (
                    <Box sx={{ position: "absolute", top: 10, right: 10, bgcolor: "#D6FF00", borderRadius: "50%", p: 0.5, border: "2px solid #000" }}>
                        <StarIcon sx={{ color: "#000" }} />
                    </Box>
                )}

                <CardMedia
                    component="img"
                    height="180"
                    image={producto.imagenes[0]}
                    alt={producto.nombre}
                    sx={{ objectFit: "contain", p: 1, borderBottom: "3px solid #000", bgcolor: "#fff" }}
                />
                
                <CardContent sx={{ flexGrow: 1, bgcolor: "#fff" }}>
                    <Typography variant="h6" fontWeight="900" mb={1} sx={{ whiteSpace: "normal" }}>
                        {producto.nombre}
                    </Typography>
                    <Typography variant="h6" fontWeight="900" color="primary" mb={2}>
                        ${producto.precio} MXN
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={0.5} mb={2}>
                        {producto.sabores.map((sabor, idx) => (
                            <Chip 
                                key={idx}
                                label={`${sabor.nombre} (${sabor.cantidad})`}
                                size="small"
                                sx={{ 
                                    fontWeight: "bold", border: "2px solid #000",
                                    bgcolor: sabor.cantidad <= 0 ? "#FF3366" : "#fff",
                                    color: sabor.cantidad <= 0 ? "#fff" : "#000"
                                }}
                            />
                        ))}
                    </Stack>
                </CardContent>

                <Stack direction="row" sx={{ borderTop: "3px solid #000" }}>
                    <Button 
                        fullWidth onClick={() => setOpenEdit(true)}
                        startIcon={<EditIcon />} 
                        sx={{ color: "#000", fontWeight: "900", borderRight: "3px solid #000", borderRadius: 0, "&:hover": { bgcolor: "#D6FF00" } }}
                    >
                        EDITAR
                    </Button>
                    <Button 
                        fullWidth onClick={handleDeleteProduct}
                        startIcon={<DeleteIcon />} 
                        sx={{ color: "#fff", bgcolor: "#FF3366", fontWeight: "900", borderRadius: 0, "&:hover": { bgcolor: "#e60039" } }}
                    >
                        BORRAR
                    </Button>
                </Stack>
            </Card>

            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { border: "4px solid #000", borderRadius: "16px", boxShadow: "10px 10px 0px #000" } }}>
                <DialogTitle sx={{ fontWeight: "900", fontFamily: "Caprasimo", bgcolor: "#D6FF00", borderBottom: "3px solid #000" }}>
                    EDITAR PRODUCTO
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Stack spacing={3} mt={1}>
                        
                        <FormControlLabel
                            control={<Switch checked={editData.star} onChange={(e) => setEditData({ ...editData, star: e.target.checked })} color="secondary" />}
                            label={<Typography fontWeight="900">¿Es un producto Estrella? ⭐</Typography>}
                        />

                        <TextField label="Nombre" name="nombre" value={editData.nombre} onChange={handleChange} fullWidth />
                        <TextField label="Precio" name="precio" type="number" value={editData.precio} onChange={handleChange} fullWidth />
                        <TextField label="Descripción" name="descripcion" value={editData.descripcion} onChange={handleChange} multiline rows={3} fullWidth />
                        <TextField label="Marca" name="marca" value={editData.marca} onChange={handleChange} fullWidth />

                        <Typography fontWeight="900" borderBottom="2px solid #000" pb={1}>SABORES Y STOCK</Typography>
                        {editData.sabores.map((s, idx) => (
                            <Stack direction="row" spacing={2} key={idx}>
                                <TextField label="Sabor" value={s.nombre} onChange={(e) => handleFlavorChange(idx, "nombre", e.target.value)} sx={{ width: "70%" }} />
                                <TextField label="Stock" type="number" value={s.cantidad} onChange={(e) => handleFlavorChange(idx, "cantidad", e.target.value)} sx={{ width: "30%" }} />
                            </Stack>
                        ))}
                        <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={() => setEditData({ ...editData, sabores: [...editData.sabores, { nombre: "", cantidad: 0 }] })} sx={{ border: "2px solid #000", color: "#000", fontWeight: "bold" }}>
                            Añadir Sabor
                        </Button>

                        <Typography fontWeight="900" borderBottom="2px solid #000" pb={1}>IMÁGENES ACTUALES</Typography>
                        <Stack direction="row" spacing={2} overflow="auto" pb={1}>
                            {existingImages.map((img, idx) => (
                                <Box key={idx} position="relative" border="2px solid #000" borderRadius="8px" p={0.5}>
                                    <img src={img} alt="preview" width={80} height={80} style={{ objectFit: "contain" }} />
                                    <IconButton size="small" sx={{ position: "absolute", top: -10, right: -10, bgcolor: "#FF3366", color: "#fff", "&:hover":{bgcolor: "#000"} }} onClick={() => handleRemoveExistingImage(idx)}>
                                        <DeleteForeverIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>

                        {newImages.length > 0 && (
                            <>
                                <Typography fontWeight="900" borderBottom="2px solid #00E5FF" pb={1} mt={2}>
                                    NUEVAS IMÁGENES AÑADIDAS
                                </Typography>
                                <Stack direction="row" spacing={2} overflow="auto" pb={1}>
                                    {newImages.map((file, idx) => (
                                        <Box key={`new-${idx}`} position="relative" border="3px solid #00E5FF" borderRadius="8px" p={0.5} sx={{ flexShrink: 0, bgcolor: "#f0ffff" }}>
                                            <img src={URL.createObjectURL(file)} alt="new preview" width={80} height={80} style={{ objectFit: "contain" }} />
                                            <IconButton size="small" sx={{ position: "absolute", top: -10, right: -10, bgcolor: "#FF3366", color: "#fff", "&:hover":{bgcolor: "#000"} }} onClick={() => handleRemoveNewImage(idx)}>
                                                <DeleteForeverIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Stack>
                            </>
                        )}

                        <Button variant="contained" component="label" startIcon={<PhotoLibraryIcon />} sx={{ bgcolor: "#000", color: "#fff", fontWeight: "bold" }}>
                            SUBIR NUEVAS IMÁGENES
                            <input type="file" hidden multiple accept="image/*" onChange={handleAddNewImages} />
                        </Button>

                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: "3px solid #000" }}>
                    <Button onClick={() => setOpenEdit(false)} sx={{ color: "#000", fontWeight: "bold" }}>CANCELAR</Button>
                    <Button onClick={handleSaveEdit} disabled={loading} variant="contained" sx={{ bgcolor: "#00E5FF", color: "#000", fontWeight: "900", border: "2px solid #000" }}>
                        {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminProductCard;