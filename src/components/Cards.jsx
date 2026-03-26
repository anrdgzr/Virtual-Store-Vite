import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import MoreInfoDialog from "./MoreInfoDialog";
import { useState } from "react";
import CardComponent from "./CardComponent";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Cards = ({ productos, token, favorites, handleToggleFavorite, section = "cat" }) => {
    const [open, setOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    
    const handleOpen = (producto) => {
        setProductoSeleccionado(producto);
        setOpen(true);
    };

    const handleClose = () => {
        setProductoSeleccionado(null);
        setOpen(false);
    }
    return(
        <>
            {section === "cat" ? (
                <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
                    <Grid container spacing={3} justifyContent="center" maxWidth="lg">
                        {productos.map((producto) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={producto.id}>
                                <CardComponent 
                                    producto={producto}
                                    handleOpen={handleOpen}
                                    token={token}
                                    favorites={favorites}
                                    handleToggleFavorite={handleToggleFavorite}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ) : (
                <Stack spacing={2}>
                    {favorites.map((fav) => {
                        return(
                            <Box 
                                key={fav._id} 
                                position={"relative"}
                                display="flex" 
                                alignItems="center" 
                                gap={2} 
                                p={1} 
                                border="2px solid #000" 
                                borderRadius="8px"
                                sx={{ 
                                    cursor: "pointer", 
                                    transition: "all 0.2s", 
                                    "&:hover": { 
                                        bgcolor: "#f4f5f7", 
                                        transform: "translate(-2px, -2px)", 
                                        boxShadow: "4px 4px 0px #000" 
                                    } 
                                }}
                                onClick={() => handleOpen(fav)}
                            >
                                <IconButton
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleToggleFavorite(e, fav._id ? fav._id : fav.id);
                                    }}
                                    sx={{
                                        position: "absolute",
                                        top: -10,
                                        right: -10,
                                        bgcolor: "#fff",
                                        border: "2px solid #000",
                                        boxShadow: "4px 4px 0px #000",
                                        zIndex: 10,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            bgcolor: "#f4f5f7",
                                            transform: "translate(-2px, -2px)",
                                            boxShadow: "6px 6px 0px #000",
                                        }
                                    }}
                                >
                                    <FavoriteIcon sx={{ color: "#FF3366", fontSize: "1.5rem" }} />
                                </IconButton>
                                <img src={fav.imagenes[0]} alt={fav.nombre} width={50} height={50} style={{ objectFit: "contain" }} />
                                <Box flex={1}>
                                    <Typography fontWeight="900" lineHeight={1.1}>{fav.nombre}</Typography>
                                    <Typography variant="body2" color="primary" fontWeight="bold">${fav.precio}</Typography>
                                </Box>
                            </Box>
                        )
                    })}
                </Stack>
            )}
            <MoreInfoDialog
                onClose={handleClose}
                productoSeleccionado={productoSeleccionado}
                open={open} 
                setOpen={setOpen}
            />
        </>
    )
}

export default Cards;