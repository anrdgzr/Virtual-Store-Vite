import { useState, useEffect } from "react";
import { Box, Typography, Stack, Button, Chip, Tabs, Tab } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WarningIcon from "@mui/icons-material/Warning";
import { notify } from "../utils/notify";
import { api } from "../network/api";

const EntregasPersonales = ({ isExpanded }) => {
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0); 

    useEffect(() => {
        const fetchEntregas = async () => {
            try {
                const res = await api.get("/api/orders");
                
                const pendingDeliveries = res.data.filter(order => 
                    (order.tipoEnvio === "personal" || order.tipoEnvio === "encuentro") &&
                    order.estado !== "entregado" && 
                    order.estado !== "cancelado"
                );

                const deliveriesWithDeadlines = pendingDeliveries.map(order => {
                    const orderDate = new Date(order.createdAt);
                    const deadline = new Date(orderDate);
                    deadline.setDate(deadline.getDate() + 5);
                    
                    const today = new Date();
                    const diffTime = deadline - today;
                    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    return { ...order, daysRemaining };
                });

                deliveriesWithDeadlines.sort((a, b) => a.daysRemaining - b.daysRemaining);

                setEntregas(deliveriesWithDeadlines);
            } catch (error) {
                console.error("Error fetching deliveries:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isExpanded) {
            fetchEntregas();
        }
    }, [isExpanded]);

    const handleMarcarEntregado = async (e, id) => {
        e.stopPropagation();
        try {
            await api.put("/api/orders/update-status", { id, status: "entregado" });
            setEntregas(prev => prev.filter(order => order._id !== id));
            notify.success("¡Pedido marcado como entregado!");
        } catch (error) {
            console.error("Error updating status:", error);
            notify.error("Error al actualizar el pedido");
        }
    };

    const entregasDomicilio = entregas.filter(e => e.tipoEnvio === "personal");
    const entregasEncuentro = entregas.filter(e => e.tipoEnvio === "encuentro");

    if (loading) return <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo" p={2}>BUSCANDO RUTAS...</Typography>;

    const renderOrderList = (orderList) => {
        if (orderList.length === 0) {
            return (
                <Box textAlign="center" p={4} mt={2} sx={{ border: "4px dashed #000", borderRadius: "12px", bgcolor: "#fff" }}>
                    <Typography variant="h6" fontWeight="900">No hay entregas en esta categoría.</Typography>
                </Box>
            );
        }

        return orderList.map((order) => {
            let urgencyColor = "#00E5FF"; 
            let urgencyText = `Quedan ${order.daysRemaining} días`;
            
            if (order.daysRemaining <= 1) {
                urgencyColor = "#FF3366"; 
                urgencyText = order.daysRemaining < 0 ? "¡RETRASADO!" : "ENTREGAR HOY/MAÑANA";
            } else if (order.daysRemaining <= 3) {
                urgencyColor = "#D6FF00"; 
            }

            return (
                <Box
                    key={order._id}
                    sx={{
                        p: { xs: 2, md: 3 }, mb: 3, borderRadius: "12px", bgcolor: "#fff",
                        border: "4px solid #000", boxShadow: `6px 6px 0px ${urgencyColor}`, 
                        transition: "all 0.2s",
                        "&:hover": { transform: "translate(-2px, -2px)", boxShadow: `8px 8px 0px ${urgencyColor}` }
                    }}
                >
                    <Box 
                        sx={{ 
                            bgcolor: urgencyColor, mx: { xs: -2, md: -3 }, mt: { xs: -2, md: -3 }, mb: 2, p: 1, 
                            borderBottom: "4px solid #000", display: "flex", justifyContent: "center", alignItems: "center", gap: 1
                        }}
                    >
                        {order.daysRemaining <= 1 && <WarningIcon sx={{ color: "#000" }} />}
                        <Typography fontWeight="900" textTransform="uppercase" color="#000">{urgencyText}</Typography>
                    </Box>

                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={2} mb={2}>
                        <Box>
                            <Typography fontWeight="900" fontSize="1.2rem" sx={{ textTransform: "uppercase" }}>#{order._id.slice(-6)}</Typography>
                            <Typography fontWeight="bold" color="text.secondary">{order.datosCliente.nombre} • {order.datosCliente.telefono}</Typography>
                        </Box>
                        <Chip
                            icon={order.tipoEnvio === "encuentro" ? <LocationOnIcon style={{ color: "#000" }} /> : <LocalShippingIcon style={{ color: "#000" }} />}
                            label={order.tipoEnvio}
                            sx={{ bgcolor: "#fff", color: "#000", fontWeight: "900", border: "2px solid #000", textTransform: "uppercase" }}
                        />
                    </Stack>

                    <Box sx={{ bgcolor: "#f4f5f7", p: 1.5, border: "2px solid #000", borderRadius: "8px", mb: 2 }}>
                        <Typography fontSize="0.8rem" color="#FF3366" fontWeight="900" textTransform="uppercase">
                            {order.tipoEnvio === "encuentro" ? "Punto de Encuentro:" : "Dirección de Entrega:"}
                        </Typography>
                        <Typography fontWeight="bold">{order.datosCliente.direccion}</Typography>
                    </Box>

                    <Box mb={3}>
                        <Typography fontSize="0.8rem" color="#000" fontWeight="900" textTransform="uppercase" mb={1}>Llevar en la mochila:</Typography>
                        {order.productos.map((p) => (
                            <Typography key={p._id} variant="body2" fontWeight="bold">
                                • {p.cantidad}x {p.producto?.nombre} <span style={{ color: "#666" }}>
                                    ({p.sabores?.map(s => `${s.cantidad} ${s.nombre}`).join(", ")})
                                </span>
                            </Typography>
                        ))}
                    </Box>

                    <Button
                        fullWidth onClick={(e) => handleMarcarEntregado(e, order._id)}
                        sx={{
                            bgcolor: "#000", color: "#fff", fontWeight: "900", fontSize: "1.1rem",
                            border: "3px solid #000", borderRadius: "8px", py: 1.5, transition: "all 0.2s",
                            "&:hover": { bgcolor: urgencyColor, color: "#000", transform: "translate(-2px, -2px)", boxShadow: "4px 4px 0px #000" }
                        }}
                    >
                        MARCAR COMO ENTREGADO
                    </Button>
                </Box>
            );
        });
    };

    return (
        <Box display="flex" flexDirection="column" height="100%">
            
            <Tabs 
                value={tabValue} 
                onChange={(e, newValue) => {
                    e.stopPropagation();
                    setTabValue(newValue);
                }} 
                variant="fullWidth"
                sx={{
                    mb: 3,
                    minHeight: "50px",
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#000",
                        height: "4px",
                    }
                }}
            >
                <Tab 
                    label={`A Domicilio (${entregasDomicilio.length})`} 
                    sx={{ 
                        fontWeight: "900", 
                        fontSize: { xs: "0.8rem", sm: "1rem" },
                        color: tabValue === 0 ? "#000 !important" : "#888",
                        bgcolor: tabValue === 0 ? "#00E5FF" : "transparent",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        border: tabValue === 0 ? "3px solid #000" : "none",
                        borderBottom: "none",
                        transition: "all 0.2s"
                    }} 
                />
                <Tab 
                    label={`Encuentros (${entregasEncuentro.length})`} 
                    sx={{ 
                        fontWeight: "900", 
                        fontSize: { xs: "0.8rem", sm: "1rem" },
                        color: tabValue === 1 ? "#000 !important" : "#888",
                        bgcolor: tabValue === 1 ? "#D6FF00" : "transparent",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        border: tabValue === 1 ? "3px solid #000" : "none",
                        borderBottom: "none",
                        transition: "all 0.2s"
                    }} 
                />
            </Tabs>

            <Box 
                sx={{ 
                    flexGrow: 1,
                    maxHeight: isExpanded ? "none" : "240px", 
                    overflowY: isExpanded ? "visible" : "hidden",
                    pb: isExpanded ? 2 : 1,
                }}
            >
                {tabValue === 0 ? renderOrderList(entregasDomicilio) : renderOrderList(entregasEncuentro)}
            </Box>
        </Box>
    );
};

export default EntregasPersonales;