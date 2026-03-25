import { 
    Card, 
    CardContent, 
    CardMedia, 
    IconButton, 
    Typography 
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const CardComponent = ({
    producto,
    handleOpen,
    isHome,
    token,
    favorites = [],
    handleToggleFavorite,
}) => {
    const isLargetitle = producto.nombre.length > 13;
    console.log("FAVS: ", favorites)
    return(
        <Card
            sx={{
                maxWidth: 345,
                margin: "auto",
                borderRadius: "12px",
                boxShadow: "6px 6px 0px #000",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    transform: "translate(-4px, -4px)",
                    boxShadow: "10px 10px 0px #000",
                    cursor: "pointer",
                },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                border: "3px solid #000",
                width: 200,
                height: 300 + (
                    isLargetitle 
                        ? isHome
                            ? 0 
                            : 40
                        : 0
                ),
                position: "relative",
                overflow: "visible",
            }}
            onClick={() => {
                handleOpen(producto)
            }}
        >
            {token && (
                <IconButton
                    onClick={(e) => handleToggleFavorite(e, producto._id ? producto._id : producto.id )}
                    onMouseDown={(e) => e.stopPropagation()}
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
                    {favorites?.includes( producto._id ?? producto.id) ? (
                        <FavoriteIcon sx={{ color: "#FF3366", fontSize: "1.8rem" }} /> 
                    ) : (
                        <FavoriteBorderIcon sx={{ color: "#000", fontSize: "1.8rem" }} /> 
                    )}
                </IconButton>
            )}
            {producto.imagenes && (
                <CardMedia
                    component="img"
                    image={producto.imagenes[0]}
                    alt={producto.nombre}
                    sx={{
                        transition: "transform 0.3s",
                        "&:hover": {
                            transform: "scale(1.2)"
                        },
                        objectFit: "contain",
                        height: 200,
                        width:"100%"
                    }}
                />
            )}
            <CardContent>
                <Typography variant="h6" textAlign="center">
                    {producto.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    {producto.descripcion}
                </Typography>
            </CardContent>
        </Card>
    )
};
export default CardComponent;