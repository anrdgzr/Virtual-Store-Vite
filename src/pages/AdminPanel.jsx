import { useEffect, useState } from "react";
import AddBrandForm from "../components/AddBrandForm";
import AddProductForm from "../components/AddProductForm"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { api } from "../network/api";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CardMedia, Chip, Grid, Stack, Typography } from "@mui/material";
import AdminProductCard from "../components/admin/AdminProductCard";

const AdminPanel = () => {

    const [productos, setProductos] = useState([]);

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get("/api/products");
            setProductos(res.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const fetchOrdenes = async () => {
        try {
            const res = await api.get("/api/orders");
            console.log("Ordenes:", res.data);
            return res.data;
        } catch (err) {
            console.error("Error obteniendo órdenes:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchOrdenes();
    }, [])

    const productosAgrupados = productos.reduce((acc, producto) => {
        const marca = producto.marca || "Unknwon";
        if (!acc[marca]) {
            acc[marca] = [];
        }
        acc[marca].push(producto);
        return acc;
    }, {});

    const brutalistAccordion = {
        border: "3px solid #000",
        boxShadow: "6px 6px 0px #000",
        mb: 3,
        borderRadius: "12px !important",
        "&:before": { display: "none" },
        overflow: "hidden"
    };

    return (
        <Box maxWidth="lg" mx="auto" p={3}>
            <Typography variant="h3" fontFamily="Caprasimo" fontWeight="900" mb={4} textAlign="center" sx={{ textTransform: "uppercase" }}>
                Panel de Control
            </Typography>
            <Box mb={6}>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={brutalistAccordion}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#000", fontSize: "2rem" }} />} sx={{ bgcolor: "#D6FF00", borderBottom: expanded === 'panel1' ? "3px solid #000" : "none" }}>
                        <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo">
                            AGREGAR NUEVA MARCA
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: "#fff", p: 3 }}>
                        <AddBrandForm />
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={brutalistAccordion}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#000", fontSize: "2rem" }} />} sx={{ bgcolor: "#00E5FF", borderBottom: expanded === 'panel2' ? "3px solid #000" : "none" }}>
                        <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo">
                            AGREGAR NUEVO PRODUCTO
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: "#fff", p: 3 }}>
                        <AddProductForm />
                    </AccordionDetails>
                </Accordion>
            </Box>

            <Typography variant="h4" fontFamily="Caprasimo" fontWeight="900" mb={4} sx={{ borderBottom: "4px solid #000", display: "inline-block", pb: 1 }}>
                INVENTARIO ACTUAL
            </Typography>
            {Object.keys(productosAgrupados).map((marca) => (
                <Box key={marca} sx={{ mb: 6, p: 3, bgcolor: "#f4f5f7", border: "3px solid #000", borderRadius: "12px", boxShadow: "8px 8px 0px #000" }}>
                    
                    <Typography variant="h4" fontFamily="Caprasimo" fontWeight="900" sx={{ mb: 3, color: "#FF3366", textTransform: "uppercase", textShadow: "2px 2px 0px #000" }}>
                        {marca}
                    </Typography>

                    <Stack 
                        direction="row" 
                        spacing={3} 
                        sx={{ 
                            overflowX: "auto", 
                            pb: 2,
                            "&::-webkit-scrollbar": { height: "12px" },
                            "&::-webkit-scrollbar-track": { bgcolor: "#eee", border: "2px solid #000", borderRadius: "8px" },
                            "&::-webkit-scrollbar-thumb": { bgcolor: "#000", borderRadius: "8px" },
                        }}
                    >
                        {productosAgrupados[marca].map((producto) => (
                            <AdminProductCard 
                                key={producto._id} 
                                producto={producto} 
                                refreshProducts={fetchProducts}
                            />
                        ))}
                    </Stack>
                </Box>
            ))}

        </Box>
    )
}

export default AdminPanel;