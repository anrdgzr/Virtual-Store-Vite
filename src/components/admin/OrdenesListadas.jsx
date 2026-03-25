import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  Avatar,
  Grid,
  Button
} from "@mui/material";
import { api } from "../../network/api";

const OrdenesListadas = ({ isExpanded }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orders.length > 0) return;

    const getOrders = async () => {
        try {
            const res = await api.get("/api/orders");
            setOrders(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    getOrders();
  }, []);

  const updateStatusOrder = async (id, status) => {
    try {
      await api.put("/api/orders/update-status", { id, status });
      setOrders(prev =>
        prev.map(order => order._id === id ? { ...order, estado: status } : order)
      );
    } catch (error) {
      console.error("Error al actualizar estado de la orden: ", id, " -> ", status)
    }
  }

  if (loading) return <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo" sx={{ p: 2 }}>CARGANDO ÓRDENES...</Typography>;
  if (orders.length === 0) return <Typography variant="h6" fontWeight="900" sx={{ p: 2 }}>No hay órdenes activas.</Typography>;

  return (
    <Box 
      sx={{ 
        maxHeight: isExpanded ? "100%" : "200px", 
        overflowY: isExpanded ? "visible" : "hidden",
        pb: isExpanded ? 10 : 1,
      }}
    >
      {orders.map((order) => (
        <Box
          key={order._id}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "12px",
            bgcolor: "#fff",
            border: "3px solid #000",
            boxShadow: isExpanded ? "6px 6px 0px #000" : "4px 4px 0px #000", 
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translate(-2px, -2px)",
              boxShadow: "8px 8px 0px #000"
            }
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography fontWeight="900" fontSize="1.1rem" color="#000" sx={{ textTransform: "uppercase" }}>
              #{order._id.slice(-6)}
            </Typography>
            <Chip
              label={order.estado}
              sx={{ 
                bgcolor: order.estado === "pagado" ? "#D6FF00" : "#FF3366", 
                color: "#000",
                fontWeight: "900",
                border: "2px solid #000",
                textTransform: "uppercase"
              }}
              size="small"
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontSize="0.9rem" color="text.secondary" fontWeight="bold">
              {order.productos.reduce((acc, p) => acc + p.cantidad, 0)} items
            </Typography>
            <Typography fontWeight="900" fontSize="1.2rem" color="#000">
              ${order.total.toFixed(2)}
            </Typography>
          </Stack>

          {isExpanded && (
            <Box sx={{ mt: 2, pt: 2, borderTop: "3px solid #000" }}>   
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography fontSize="0.8rem" color="#FF3366" fontWeight="900" textTransform="uppercase">Cliente</Typography>
                  <Typography fontWeight="900" fontSize="1.1rem">{order.datosCliente.nombre}</Typography>
                  <Typography fontWeight="bold" color="text.secondary">{order.datosCliente.telefono}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography fontSize="0.8rem" color="#FF3366" fontWeight="900" textTransform="uppercase">Logística</Typography>
                  <Typography fontWeight="bold">
                    Envío: {order.tipoEnvio === 'app' ? 'App / Repartidor' : order.tipoEnvio}
                  </Typography>
                  <Typography fontWeight="bold">
                    Pago: {order.metodoPago}
                  </Typography>
                </Grid>
              </Grid>

              <Typography fontSize="0.8rem" color="#FF3366" fontWeight="900" textTransform="uppercase" mb={1}>Productos</Typography>
              {order.productos.map((p) => (
                <Stack direction="row" spacing={2} key={p._id} sx={{ mb: 2, alignItems: "center" }}>
                  <Avatar
                    src={p.producto.imagenes[0]} 
                    variant="square"
                    sx={{ width: 48, height: 48, border: "2px solid #000", bgcolor: "#fff" }}
                  />
                  <Box flex={1}>
                    <Typography fontWeight="900" lineHeight={1.2}>
                      {p.producto.nombre}
                    </Typography>
                    <Typography fontSize="0.85rem" fontWeight="bold" color="text.secondary">
                      {p.sabores?.map(s => `${s.cantidad}x ${s.nombre}`).join(" • ")}
                    </Typography>
                  </Box>
                  <Typography fontWeight="900" fontSize="1.1rem">
                    x{p.cantidad}
                  </Typography>
                </Stack>
              ))}

              <Box sx={{ mt: 3, pt: 2, borderTop: "3px solid #000", display: "flex", justifyContent: "flex-end" }}>
                {order.estado === 'pendiente' ? (
                  <Button
                    fullWidth
                    sx={{ 
                      bgcolor: "#000",
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: "1.1rem",
                      border: "3px solid #000",
                      borderRadius: "8px",
                      py: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "#D6FF00",
                        color: "#000",
                        transform: "translate(-2px, -2px)",
                        boxShadow: "4px 4px 0px #000"
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatusOrder(order._id, "pagado")
                    }}
                  >
                    MARCAR COMO PAGADO
                  </Button>
                ) : (
                  <Typography fontWeight="900" color="#2e7d32" sx={{ display: 'flex', alignItems: 'center' }}>
                    PAGO APROBADO
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default OrdenesListadas;
