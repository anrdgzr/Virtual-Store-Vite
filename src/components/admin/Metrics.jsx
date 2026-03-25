import { useState, useEffect } from "react";
import { Box, Typography, Stack, Grid, Avatar, MenuItem, Select } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { api } from "../../network/api";

const Metrics = ({ isExpanded }) => {
  const [rango, setRango] = useState("mes");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/metrics?rango=${rango}`);
        setMetrics(res.data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
          
        setMetrics({
          ingresos: 42500.00,
          pedidos: 124,
          ticketPromedio: 342.74,
          tasaConversion: "4.2%",
          topProductos: [
            { _id: "1", nombre: "Waka Blast 33k", ventas: 85, color: "#FF3366" },
            { _id: "2", nombre: "Tornado 10k", ventas: 62, color: "#00E5FF" },
            { _id: "3", nombre: "ElfBar BC5000", ventas: 41, color: "#D6FF00" },
            { _id: "4", nombre: "GeekBar Pulse", ventas: 38, color: "#FF9900" },
            { _id: "5", nombre: "Lost Mary OS5000", ventas: 29, color: "#B000FF" },
          ],
          topMarcas: [
            { _id: "Waka", ventas: 145 },
            { _id: "RandM", ventas: 98 },
            { _id: "ElfBar", ventas: 76 },
          ],
          vipUsers: [
            { _id: "u1", nombre: "Carlos M.", pedidos: 12, totalGastado: 4500 },
            { _id: "u2", nombre: "Ana G.", pedidos: 9, totalGastado: 3200 },
            { _id: "u3", nombre: "Luis R.", pedidos: 7, totalGastado: 2800 },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [rango]);

  if (loading || !metrics) return <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo" p={2}>CALCULANDO MÉTRICAS...</Typography>;

  if (!isExpanded) {
    return (
      <Box p={2} height="100%" display="flex" flexDirection="column" justifyContent="center">
        <Stack direction="row" justifyContent="space-around" alignItems="center">
          <Box textAlign="center">
            <Typography fontSize="0.8rem" fontWeight="900" color="text.secondary" textTransform="uppercase">Ingresos (Mes)</Typography>
            <Typography variant="h4" fontWeight="900" color="#2e7d32">
              ${(metrics.ingresos / 1000).toFixed(1)}k
            </Typography>
          </Box>
            <Box sx={{ width: "4px", height: "40px", bgcolor: "#000" }} /> {/* Divider */}
            <Box textAlign="center">
              <Typography fontSize="0.8rem" fontWeight="900" color="text.secondary" textTransform="uppercase">Pedidos</Typography>
              <Typography variant="h4" fontWeight="900" color="#000">
                {metrics.pedidos}
              </Typography>
            </Box>
        </Stack>
        <Typography textAlign="center" fontSize="0.75rem" fontWeight="bold" color="#666" mt={2}>
          Top Venta: {metrics.topProductos[0]?.nombre}
        </Typography>
      </Box>
    );
  }
  
  const MetricBlock = ({ title, value, icon, color }) => (
    <Box sx={{ p: 2, bgcolor: color, border: "4px solid #000", borderRadius: "12px", boxShadow: "4px 4px 0px #000", display: "flex", alignItems: "center", gap: 2 }}>
      <Box sx={{ bgcolor: "#fff", p: 1, borderRadius: "8px", border: "2px solid #000", display: "flex" }}>{icon}</Box>
      <Box>
        <Typography fontSize="0.75rem" fontWeight="900" textTransform="uppercase" lineHeight={1}>{title}</Typography>
        <Typography variant="h5" fontWeight="900" fontFamily="Caprasimo">{value}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        height: "100%", pb: 4, pr: 2,
        "&::-webkit-scrollbar": { width: "10px" },
        "&::-webkit-scrollbar-track": { bgcolor: "#fff", borderLeft: "3px solid #000" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "#000", borderLeft: "3px solid #000" },
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} mb={4} gap={2}>
        <Typography variant="h5" fontWeight="900" fontFamily="Caprasimo" textTransform="uppercase">
          Rendimiento
        </Typography>
          
        <Select
          value={rango}
          onChange={(e) => {
            e.stopPropagation();
            setRango(e.target.value);
          }}
          size="small"
          sx={{
            bgcolor: "#fff", border: "3px solid #000", borderRadius: "8px", fontWeight: "900",
            boxShadow: "4px 4px 0px #000", "& .MuiOutlinedInput-notchedOutline": { border: "none" }
          }}
        >
          <MenuItem value="hoy" sx={{ fontWeight: "bold" }}>Hoy</MenuItem>
          <MenuItem value="semana" sx={{ fontWeight: "bold" }}>Esta Semana</MenuItem>
          <MenuItem value="mes" sx={{ fontWeight: "bold" }}>Este Mes</MenuItem>
          <MenuItem value="siempre" sx={{ fontWeight: "bold" }}>Histórico Global</MenuItem>
        </Select>
      </Stack>

        <Grid container spacing={2} mb={4}>
          <Grid item xs={6} md={3}><MetricBlock title="Ingresos" value={`$${metrics.ingresos.toLocaleString()}`} icon={<AttachMoneyIcon />} color="#D6FF00" /></Grid>
          <Grid item xs={6} md={3}><MetricBlock title="Pedidos" value={metrics.pedidos} icon={<ShoppingCartIcon />} color="#00E5FF" /></Grid>
          <Grid item xs={6} md={3}><MetricBlock title="Ticket Promedio" value={`$${metrics.ticketPromedio}`} icon={<TrendingUpIcon />} color="#FF3366" /></Grid>
          <Grid item xs={6} md={3}><MetricBlock title="Conversión" value={metrics.tasaConversion} icon={<StarIcon />} color="#E3F2FD" /></Grid>
        </Grid>

        <Grid container spacing={3}>                
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: "#fff", border: "4px solid #000", borderRadius: "12px", p: 2, boxShadow: "6px 6px 0px #000", height: "100%" }}>
              <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo" mb={2} textTransform="uppercase">Top 5 Productos</Typography>
              <Stack spacing={2}>
                {metrics.topProductos.map((prod, index) => (
                  <Box key={prod._id} display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: prod.color || "#000", color: "#fff", fontWeight: "900", border: "2px solid #000", width: 32, height: 32 }}>
                      {index + 1}
                    </Avatar>
                    <Box flex={1}>
                      <Typography fontWeight="900" lineHeight={1.1}>{prod.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight="bold">{prod.ventas} unidades vendidas</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3} height="100%">
                
              <Box sx={{ bgcolor: "#000", color: "#fff", border: "4px solid #000", borderRadius: "12px", p: 2, boxShadow: "6px 6px 0px #FF3366", flex: 1 }}>
                <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo" mb={2} color="#D6FF00" textTransform="uppercase">Top 3 Marcas</Typography>
                {metrics.topMarcas.map((marca, index) => (
                  <Box key={marca._id} display="flex" justifyContent="space-between" mb={1} borderBottom="1px dashed #333" pb={1}>
                    <Typography fontWeight="bold">{index + 1}. {marca._id}</Typography>
                    <Typography fontWeight="900" color="#00E5FF">{marca.ventas} ventas</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ bgcolor: "#fff", border: "4px solid #000", borderRadius: "12px", p: 2, boxShadow: "6px 6px 0px #000", flex: 1 }}>
                <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo" mb={2} textTransform="uppercase">Clientes VIP</Typography>
                {metrics.vipUsers.map((user) => (
                  <Box key={user._id} display="flex" justifyContent="space-between" mb={1}>
                    <Typography fontWeight="bold">{user.nombre}</Typography>
                    <Box textAlign="right">
                      <Typography fontWeight="900" lineHeight={1}>${user.totalGastado}</Typography>
                      <Typography fontSize="0.7rem" color="text.secondary" fontWeight="bold">{user.pedidos} pedidos</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

            </Stack>
          </Grid>
        </Grid>
    </Box>
  );
};

export default Metrics;