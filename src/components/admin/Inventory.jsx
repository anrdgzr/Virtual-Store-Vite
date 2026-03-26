import { useState, useEffect } from "react";
import { Box, Typography, Stack, Button, Chip, Avatar } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { api } from "../../network/api";
import { notify } from "../../utils/notify";

const Inventory = ({ isExpanded }) => {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventario = async () => {
            try {
                console.log("HI")
                const res = await api.get("/api/products");
                
                const stockItems = [];

                res.data.forEach(producto => {
                    if (producto.sabores && producto.sabores.length > 0) {
                        producto.sabores.forEach(sabor => {
                            stockItems.push({
                                id: `${producto._id}-${sabor.nombre}`,
                                productoId: producto._id,
                                nombre: producto.nombre,
                                sabor: sabor.nombre,
                                stock: Number(sabor.cantidad),
                                imagen: producto.imagenes ? producto.imagenes[0] : null,
                                color: Number(sabor.cantidad) > 5 
                                    ? "#0FFF50"
                                    : Number(sabor.cantidad) > 2 
                                        ? "#D6FF00"
                                        : "#FF3366"
                            });
                        });
                    }
                });

                stockItems.sort((a, b) => a.stock - b.stock);

                setStock(stockItems);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        // if (isExpanded) {
            fetchInventario();
        // }
    }, []);

    if (loading) return <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo" p={2}>REVISANDO BODEGA...</Typography>;

    if (stock.length === 0) return (
        <Box p={3} textAlign="center" sx={{ bgcolor: "#FF3366", borderRadius: "12px", border: "4px solid #000", m: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 60, mb: 1, color: "#000" }} />
            <Typography variant="h5" fontWeight="900" fontFamily="Caprasimo" textTransform="uppercase">
                Sin inventario
            </Typography>
            {notify.error()}
        </Box>
    );

    return (
        <Box 
            sx={{ 
                maxHeight: isExpanded ? "none" : "200px", 
                overflowY: isExpanded ? "visible" : "hidden",
                pb: isExpanded ? 0 : 1,
            }}
        >
            {isExpanded && (
                <Box display="flex" alignItems="center" mb={0} p={0.5} pt={0} sx={{ borderRadius: "8px", border: "2px solid #FF3366" }}>
                    <Typography fontWeight="900" fontSize="1.1rem" textTransform="uppercase" color="#000">
                        {stock.length} productos en inventario.
                    </Typography>
                </Box>
            )}

            {stock.map((item) => {
                const isCritical = item.stock <= 1;
                const isLow = item.stock >= 2 && item.stock <= 5;
                const cardBg = isCritical ? "#FF3366" : isLow ? "#D6FF00" : "#fff";
                const textColor = isCritical ? "#fff" : "#000";
                const shadowColor = isCritical ? "#000" : isLow ? "#FF3366" : "#00E5FF";

                return (
                    <Box
                        key={item.id}
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: "12px",
                            bgcolor: cardBg,
                            color: textColor,
                            border: "4px solid #000",
                            boxShadow: `6px 6px 0px ${shadowColor}`,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            transition: "all 0.2s",
                            "&:hover": {
                                transform: "translate(-2px, -2px)",
                                boxShadow: `8px 8px 0px ${shadowColor}`
                            }
                        }}
                    >
                        <Avatar
                            src={item.imagen} 
                            variant="square"
                            sx={{ width: 64, height: 64, border: "3px solid #000", bgcolor: "#fff" }}
                        />

                        <Box flex={1}>
                            <Typography fontWeight="900" fontSize="1.1rem" lineHeight={1.1} sx={{ textTransform: "uppercase" }}>
                                {item.nombre}
                            </Typography>
                            <Typography fontWeight="bold" sx={{ color: isCritical ? "#fff" : "text.secondary" }}>
                                Sabor: <span style={{ color: item.color, fontWeight: "900" }}>{item.sabor}</span>
                            </Typography>
                        </Box>

                        <Box textAlign="center">
                            <Typography fontSize="0.7rem" fontWeight="900" textTransform="uppercase" mb={-0.5}>
                                Quedan
                            </Typography>
                            <Typography 
                                fontWeight="900" 
                                fontFamily="Caprasimo" 
                                fontSize="2.5rem" 
                                lineHeight={1}
                                sx={{ color: item.color }}
                            >
                                {item.stock}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default Inventory;