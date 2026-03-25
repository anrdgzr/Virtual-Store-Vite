import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useCartStoreAddToCart } from "../stores/useCartStore";
import ProductCarousel from "./ProductCarousel";
import CustomSelect from "./CustomSelect";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { notify } from "../utils/notify";

const MoreInfoDialog = ({
    productoSeleccionado,
    onClose = () => {},
    open
}) => {
    const initialStateSabores = [{
            nombre: "",
            cantidad: "",
        }];
    const addToCart = useCartStoreAddToCart();

    const [saboresSeleccionados, setSaboresSeleccionados] = useState(initialStateSabores);

    const handleAddToCart = () => {
        const saboresIncorrectos = saboresSeleccionados.filter(c => c.cantidad <= 0 || !c.nombre)

        if (saboresIncorrectos.length > 0) {
            notify.warning("Selecciona al menos un sabor con cantidad")
            return;
        }

        const itemCarrito = {
            ...productoSeleccionado,
            sabores: saboresSeleccionados.map((s) => ({
                nombre: s.nombre,
                cantidad: s.cantidad
            }))
        };

        addToCart(itemCarrito, saboresSeleccionados);
        notify.success("¡Producto agregado al carrito");

        handleClose();
    };

    const handleChangeSabor = (idx, value, section) => {
        setSaboresSeleccionados((prev) =>
            prev.map((s, i) =>
            section === "s" 
                ? i === idx
                    ? { ...s, nombre: value }
                    : s
                : i === idx
                    ? { ...s, cantidad: parseInt(value) }
                    : s
            )
        );
    };

    const handleAddSabor = () => {
        setSaboresSeleccionados((prev) => [
            ...prev,
            { nombre: "", cantidad: 0 }
        ]);
    };

    const handleDeleteSabor = (idx) => {
        setSaboresSeleccionados((prev) => {
            if (prev.length === 1) {
                return initialStateSabores;
            }

            return prev.filter((_, i) => i !== idx);
        });
    };

    const handleClose = () => {
        onClose();
        setSaboresSeleccionados(initialStateSabores);
    }
    
    return(
        <>
            {productoSeleccionado && (
                <>
                    <Dialog 
                        open={open} 
                        onClose={handleClose} 
                        maxWidth="sm" 
                        fullWidth
                        PaperProps={{
                            sx: {
                                border: "3px solid #000",
                                boxShadow: "10px 10px 0px #000",
                                borderRadius: "16px",
                                backgroundColor: "#fff",
                            }
                        }}
                    >
                        <DialogTitle>{productoSeleccionado.nombre}</DialogTitle>
                        <DialogContent>
                            <Stack
                                direction={"column"}
                                spacing={2}
                            >
                                <ProductCarousel producto={productoSeleccionado} />
                                <Stack 
                                    direction="row" 
                                    alignItems="center" 
                                    justifyContent="space-between" 
                                    spacing={2} 
                                    sx={{ mt: 1, mb: 2 }}
                                >
                                    <DialogContentText sx={{ fontSize: "1rem", color: "#333", fontWeight: "500", flex: 1 }}>
                                        {productoSeleccionado.descripcion}
                                    </DialogContentText>

                                    <Typography 
                                        variant="h6"
                                        fontWeight="900" 
                                        sx={{ 
                                            fontFamily: "Caprasimo", 
                                            bgcolor: "#FF3366", 
                                            color: "#fff",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: "8px",
                                            border: "2px solid #000",
                                            boxShadow: "3px 3px 0px #000",
                                            transform: "rotate(-3deg)", 
                                            whiteSpace: "nowrap", 
                                            mt: 0.5 
                                        }}
                                    >
                                        ${productoSeleccionado.precio} MXN
                                    </Typography>
                                </Stack>
                                <Stack
                                    spacing={2}
                                    justifyContent="center"
                                >
                                    {saboresSeleccionados.map((s, idx) => (
                                        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                            <CustomSelect
                                                label="Sabor"
                                                value={s.nombre}
                                                onChange={(e) => handleChangeSabor(idx, e.target.value, "s")}
                                                options={productoSeleccionado.sabores}
                                                getOptionLabel={(o) => o.nombre}
                                                getOptionValue={(o) => o.nombre}
                                                emptyOptionLabel="Selecciona un sabor"
                                                sx={{ flex: 2}}
                                                required
                                            />
                                            <TextField
                                                label="Cantidad"
                                                type="number"
                                                size="small"
                                                value={s.cantidad}
                                                onChange={(e) => handleChangeSabor(idx, e.target.value, "q")}
                                                sx={{ flex: 1 }}
                                                InputProps={{
                                                    sx: { fontSize: "0.9rem" }
                                                }}
                                                InputLabelProps={{
                                                    sx: { fontSize: "0.9rem" }
                                                }}
                                            />
                                            {saboresSeleccionados.length > 1 && (
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteSabor(idx)}
                                                    sx={{ alignSelf: "center", m: 0, p: 0, flex: "0 0 auto" }}
                                                >
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    ))}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "65%"
                                        }}
                                    >
                                        <IconButton
                                            color="success"
                                            onClick={() => handleAddSabor()}
                                        >
                                            <AddCircleIcon fontSize="medium" />
                                        </IconButton>
                                    </Box>
                                </Stack>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "center", mb: 1 }}>
                            <Button
                                variant="contained"
                                sx={{ 
                                    bgcolor: "#D6FF00",
                                    color: "#000",
                                    fontWeight: "900",
                                    letterSpacing: "1px",
                                    border: "2px solid #000",
                                    boxShadow: "4px 4px 0px #000",
                                    borderRadius: "8px", 
                                    minWidth: 200,
                                    py: 1.5,
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        bgcolor: "#c2e600",
                                        transform: "translate(-2px, -2px)",
                                        boxShadow: "6px 6px 0px #000",
                                    }
                                }}
                                onClick={handleAddToCart}
                            >
                                AGREGAR AL CARRITO
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    )
}

export default MoreInfoDialog;