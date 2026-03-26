import { Typography, Stack, Box, Button } from "@mui/material";
import BrandMosaic from "../components/BrandMosaic";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { api } from "../network/api";
import { Link } from "react-router-dom";
import ProductosFavSlider from "../components/ProductosFavSlider";
import ComoFuncionamos from "../components/ComoFuncionamos";
import ContactSection from "../components/ContactSection";
import "../css/Home.css"
import WhaFab from "../components/WhaFab";
import skatepark from "../assets/img/skatepark.svg"


const Home = () => {
  const [productosFav, setProductosFav] = useState([]);
  const [brands, setBrands] = useState([]);

  const fetchProducts = async () => {
    const res = await api.get("/api/products");
    const filteredProducts = res.data.filter(product => product.star === true);
    setProductosFav(filteredProducts);
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/brands")
      setBrands(res.data);
    } catch (e) {
      console.error("Error Front", e);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  },[]);

  const { ref: productosRef, inView: productosVisible } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: beneficiosRef, inView: beneficiosVisible } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: redesRef, inView: redesVisible } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  return (
    <Stack 
      spacing={2} 
      className="Main-container"
      sx={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Stack sx={{ mb: 2 }} >
        <Box
          sx={{
            backgroundImage: `url(${skatepark})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: { xs: "250px", sm: "350px", md: "400px", lg: "500px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography 
            variant="h1" 
            fontWeight="bold"
            color="white"
            sx={{
              fontFamily: "'Pirata One', sans-serif",
              fontSize: {
                xs: "4rem",
                sm: "5rem",  
                md: "6rem",  
                lg: "7rem",  
              },
              mt: { xs: 5, md: 10 },
            }}
          >
            Gault Vapes
          </Typography>
        </Box>      
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, md: 4 },
          }}
        >
          <BrandMosaic
            brands={brands} 
          />
        </Box>
        <Stack spacing={4} alignItems="center" sx={{ mt: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            size="small"
            sx={{
              bgcolor: "#000000",
            }}
            component={Link} 
            to={"/cat"}
          >
            Ver Catálogo
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{pb:6}}>
        {/* Productos Destacados */}
        <ProductosFavSlider 
          productos={productosFav} 
          productosRef={productosRef}
          productosVisible={productosVisible}  
        />

        {/* Beneficios */}
        <ComoFuncionamos 
          beneficiosRef={beneficiosRef}
          beneficiosVisible={beneficiosVisible}
        />

        {/* Contact */}
        <ContactSection 
          redesRef={redesRef}
          redesVisible={redesVisible}
        />
      </Stack>
      <WhaFab />
    </Stack>
  );
};

export default Home;