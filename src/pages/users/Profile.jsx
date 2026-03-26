import { useState, useEffect, useRef } from "react";
import { Box, Typography, Stack, Grid, Card, CardContent, Button, Chip, Divider, Avatar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { 
    useCartStoreAddToCart,
    useCartStoreData,
    useCartStoreSetGenValue 
} from "../../stores/useCartStore";
import { api } from "../../network/api";
import { notify } from "../../utils/notify";
import Cards from "../../components/Cards";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RefreshIcon from "@mui/icons-material/Refresh";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const setCartOpen = useCartStoreSetGenValue(); 
    const addToCart = useCartStoreAddToCart();
    const cart = useCartStoreData();

    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const profileRes = await api.get("/api/user/profile")

                console.log("PROFILE: ", profileRes)

                setProfile(profileRes.data);

                const ordersRes = await api.get("/api/user/orders")

                console.log("RES ORDER: ", ordersRes)
                setOrders(ordersRes.data);

            } catch (error) {
                console.error("Error fetching profile data", error);
                notify.error("Error al cargar tu perfil");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleRemoveFavorite = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const token = localStorage.getItem("token");
            await api.post("/api/user/favorites", 
                { productId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProfile((prevProfile) => ({
                ...prevProfile,
                favorites: prevProfile.favorites.filter((fav) => fav.id !== productId)
            }));

            notify.warning("Removido de tus favoritos");
        } catch (error) {
            console.error("Error removing favorite", error);
            notify.error("Error al actualizar favoritos");
        }
    };

    const handleBuyAgain = (order) => {
        const productosValidos = order.productos.filter(itemDB => itemDB.producto);

        if (productosValidos.length === 0) {
            notify.error("Los productos de este pedido ya no están disponibles.");
            return;
        }

        let huboAjustesDeStock = false;
        const itemsParaCarrito = [];

        productosValidos.forEach((itemDB) => {
            const saboresValidos = [];
            const productId = itemDB.producto._id || itemDB.producto.id;

            const itemEnCarrito = cart.find(item => item.id === productId);

            itemDB.sabores.forEach(saborDeseado => {
                const saborVivo = itemDB.producto.sabores.find(s => s.nombre === saborDeseado.nombre);
                const stockDisponible = saborVivo ? Number(saborVivo.cantidad) : 0;

                const saborEnCarrito = itemEnCarrito?.sabores.find(s => s.nombre === saborDeseado.nombre);
                const cantidadYaEnCarrito = saborEnCarrito ? Number(saborEnCarrito.cantidad) : 0;

                const capacidadRestante = Math.max(0, stockDisponible - cantidadYaEnCarrito);

                if (capacidadRestante > 0) {
                    const cantidadAñadir = Math.min(Number(saborDeseado.cantidad), capacidadRestante);
                    
                    if (cantidadAñadir < Number(saborDeseado.cantidad)) {
                        huboAjustesDeStock = true;
                    }

                    saboresValidos.push({
                        nombre: saborDeseado.nombre,
                        cantidad: cantidadAñadir
                    });
                } else {
                    huboAjustesDeStock = true; 
                }
            });

            if (saboresValidos.length > 0) {
                itemsParaCarrito.push({
                    id: productId,
                    nombre: itemDB.producto.nombre,
                    imagenes: itemDB.producto.imagenes,
                    marca: itemDB.producto.marca,
                    precio: itemDB.producto.precio,
                    sabores: saboresValidos,
                });
            }
        });

        if (itemsParaCarrito.length === 0) {
            notify.error("Ya tienes el límite de stock de estos productos en tu carrito, o están agotados.");
            return;
        }

        itemsParaCarrito.forEach(item => {
            addToCart(item, item.sabores); 
        });

        if (huboAjustesDeStock || productosValidos.length < order.productos.length) {
            notify.warning("Algunos sabores fueron ajustados según el stock y tu carrito actual.");
        } else {
            notify.success("¡Pedido agregado al carrito!");
        }
        
        setCartOpen("open", true);
    };

    if (loading) return <Typography variant="h4" textAlign="center" mt={10} fontFamily="Caprasimo">CARGANDO TU ESPACIO...</Typography>;

    const brutalistCard = {
        border: "4px solid #000",
        borderRadius: "16px",
        boxShadow: "8px 8px 0px #000",
        bgcolor: "#fff",
        height: "100%"
    };

    const handleCardClick = (index, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    };

    return (
        <Box maxWidth="xl" mx="auto" pt={2} pl={{ xs: 2, md:3 }} pb={2} pr={{ xs: 2, md: 0}}>
            <Grid container spacing={{ xs: 2, md: 4 }} >
                <Grid item xs={12} md={4} sx={{ width: { xs: "100%", md: "auto" }}}>
                    <Stack 
                        spacing={{ xs: 2, md: 3 }} 
                        alignItems={{ xs: "center", md: "stretch" }}
                        sx={{ 
                            position: { 
                                md: "sticky" 
                            }, 
                            top: { 
                                md: "100px" 
                            } 
                        }}
                    >
                        <Typography variant="h4" fontFamily="Caprasimo" fontWeight="900" mb={{ xs: 1, md: 1.5 }} textAlign={{ xs: "center", md: "left" }} sx={{ textTransform: "uppercase" }}>
                            Mi Perfil
                        </Typography>
                        <Card sx={{ ...brutalistCard, bgcolor: "#00E5FF" }}>
                            <CardContent sx={{ textAlign: "center", p: 1.5 }}>
                                <Avatar 
                                    sx={{ 
                                        width: 80, height: 80, mx: "auto", mb: 1, 
                                        bgcolor: "#FF3366", border: "3px solid #000", color: "#fff", 
                                        fontWeight: "900", fontSize: "2rem" 
                                    }}
                                >
                                    {profile?.nombre?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="h5" fontWeight="900" fontFamily="Caprasimo">{profile?.nombre}</Typography>
                                <Typography variant="body1" fontWeight="bold" color="#333">{profile?.email}</Typography>
                                <Chip 
                                    label={profile?.role === "admin" ? "ADMIN" : "MIEMBRO"} 
                                    sx={{ mt: 1, fontWeight: "900", border: "2px solid #000", bgcolor: "#D6FF00" }} 
                                />
                            </CardContent>
                        </Card>

                        <Card sx={brutalistCard}>
                            <CardContent>
                                <Typography variant="h5" fontWeight="900" fontFamily="Caprasimo" mb={1} display="flex" alignItems="center" gap={1}>
                                    <FavoriteIcon sx={{ color: "#FF3366" }} /> MIS FAVORITOS
                                </Typography>
                                <Divider sx={{ borderBottomWidth: 3, borderColor: "#000", mb: 3 }} />

                                {profile?.favorites?.length === 0 ? (
                                    <Typography fontWeight="bold" color="text.secondary">Aún no tienes vapes guardados.</Typography>
                                ) : (
                                    <Cards 
                                        favorites={profile.favorites}
                                        section="profile"
                                        handleToggleFavorite={handleRemoveFavorite}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={8} sx={{ width: { xs: "100%", md: "auto"} }}>
                    <Typography variant="h4" fontWeight="900" fontFamily="Caprasimo" mb={{ xs: 1, md: 1.5 }} textAlign={{ xs: "center", md: "left" }} sx={{ textTransform: "uppercase" }}>
                        Tus Pedidos
                    </Typography>

                    {orders.length === 0 ? (
                        <Box textAlign="center" p={5} sx={{ ...brutalistCard, borderStyle: "dashed", bgcolor: "transparent", boxShadow: "none" }}>
                            <Typography variant="h5" fontWeight="900" mb={2}>No has realizado ninguna compra.</Typography>
                            <Button variant="contained" onClick={() => navigate("/cat")} sx={{ bgcolor: "#D6FF00", color: "#000", fontWeight: "900", border: "3px solid #000", boxShadow: "4px 4px 0px #000" }}>
                                IR AL CATÁLOGO
                            </Button>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                position: "relative",
                                width: { xs: "100%", md: 600, lg: 930 },
                                maxWidth: "100%",
                                height: { xs: 480, md: 400 },
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                            }}
                        >
                            {orders.map((order, index) => {
                                const offset = index - currentIndex;
                                const isCenter = offset === 0;
                                const isLeft = offset === -1;
                                const isRight = offset === 1;
                                const isVisible = Math.abs(offset) <= 1;

                                let translateX = "0%";
                                let scale = 1;
                                let zIndex = 1;
                                let opacity = 0;
                                let filter = "blur(4px)";

                                if (isCenter) {
                                    translateX = "0%";
                                    scale = 1;
                                    zIndex = 3;
                                    opacity = 1;
                                    filter = "none";
                                } else if (isLeft) {
                                    translateX = "-50%";
                                    scale = 0.85;
                                    zIndex = 2;
                                    opacity = 0.8;
                                    filter = "blur(3px)";
                                } else if (isRight) {
                                    translateX = "50%";
                                    scale = 0.85;
                                    zIndex = 2;
                                    opacity = 0.8;
                                    filter = "blur(3px)";
                                }

                                return (
                                    <Card 
                                        key={order._id} 
                                        onClick={(e) => handleCardClick(index, e)}
                                        sx={{ 
                                            position: "absolute",
                                            left: "50%",
                                            top: "50%",
                                            
                                            transform: `translate(calc(-50% + ${translateX}), -50%) scale(${scale})`,
                                            zIndex,
                                            opacity,
                                            filter,
                                            transition: "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                            pointerEvents: isVisible ? "auto" : "none",
                                            
                                            bgcolor: isCenter ? "#00E5FF" : "#fff",
                                            border: isCenter ? "4px solid #000" : "2px solid #666", 
                                            boxShadow: isCenter ? "8px 8px 0px #000" : "none",
                                            borderRadius: "16px",
                                            cursor: isCenter ? "default" : "pointer",
                                            
                                            display: "flex", 
                                            flexDirection: "column",
                                            "&:hover": {
                                                filter: isCenter ? "none" : "blur(1px)",
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                            <Box 
                                                display="flex"
                                                flexDirection={{ xs: "column", md: "row" }}
                                                justifyContent="space-between"
                                                alignItems={{ xs: "flex-start", md: "flex-start" }}
                                                gap={1}
                                                mb={2}
                                            >
                                                <Box gap={5}>
                                                    <Typography 
                                                        fontWeight="900" 
                                                        color={isCenter ? "#000" : "text.secondary"} 
                                                        sx={{ textTransform: "uppercase", fontSize: "0.9rem" }}
                                                    >
                                                        Pedido #{order._id.substring(order._id.length - 6)}
                                                    </Typography>

                                                    <Typography 
                                                        variant="h6" 
                                                        fontWeight="900" 
                                                        color={isCenter ? "#000" : "inherit"} 
                                                        sx={{ fontSize: "1.1rem" }}
                                                    >
                                                        {new Date(order.createdAt).toLocaleDateString("es-MX", { 
                                                            year: 'numeric', month: 'long', day: 'numeric' 
                                                        })}
                                                    </Typography>

                                                    <Stack display={"flex"} spacing={4} direction={"row"} alignItems={"center"}>
                                                        <Chip 
                                                            label={order.estado || "PROCESANDO"} 
                                                            size="small"
                                                            sx={{ 
                                                                fontWeight: "900", 
                                                                border: "2px solid #000", 
                                                                bgcolor: isCenter ? "#FF3366" : "#ddd", 
                                                                color: isCenter ? "#fff" : "#000",
                                                                mt: 1
                                                            }} 
                                                        />
                                                        <Typography 
                                                            fontWeight="900" 
                                                            color={isCenter ? "#000" : "primary"} 
                                                            sx={{ fontSize: "1.1rem" }}
                                                            textAlign={ "center"}
                                                        >
                                                            ${order.total?.toFixed(2) || "0.00"} MXN
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Box>


                                            <Divider sx={{ borderBottomWidth: 3, borderColor: "#000", mb: 2 }} />

                                            <Box mb={3} flexGrow={1}>
                                                <Typography fontWeight="900" mb={1} color={isCenter ? "#000" : "inherit"}>ARTÍCULOS:</Typography>
                                                <Stack spacing={0.5}>
                                                    {order.productos?.map((item, idx) => (
                                                        <Typography key={idx} variant="body1" fontWeight="bold" color={isCenter ? "#000" : "inherit"}>
                                                            • {item.producto?.nombre || "Producto Inactivo"} <span style={{ color: isCenter ? "#333" : "#666" }}>
                                                                x {item.sabores?.reduce((acc, s) => acc + Number(s.cantidad), 0) || 1}
                                                            </span>
                                                        </Typography>
                                                    ))}
                                                </Stack>
                                            </Box>
                                            <Box
                                                display={"flex"}
                                                justifyContent={"center"}
                                            >
                                                <Button 
                                                    disabled={!isCenter}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        if (isCenter) handleBuyAgain(order);
                                                    }}
                                                    startIcon={<RefreshIcon />}
                                                    sx={{
                                                        width:"50%",
                                                        py: 0.5, 
                                                        mt: "auto", 
                                                        bgcolor: isCenter ? "#000" : "#ddd", 
                                                        color: isCenter ? "#fff" : "#666", 
                                                        fontWeight: "900", 
                                                        fontSize: "0.7rem",
                                                        border: isCenter ? "3px solid #000" : "2px solid #aaa", 
                                                        borderRadius: "8px", transition: "all 0.2s",
                                                        "&:hover": { 
                                                            bgcolor: isCenter ? "#FF3366" : "#ddd", 
                                                            transform: isCenter ? "translate(-2px, -2px)" : "none",
                                                            boxShadow: isCenter ? "6px 6px 0px #000" : "none"
                                                        }
                                                    }}
                                                >
                                                    VOLVER A COMPRAR
                                                </Button>
                                            </Box>

                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;