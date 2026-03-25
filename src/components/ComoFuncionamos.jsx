import { motion } from "framer-motion";
import { Container, Typography, Stack, Box } from "@mui/material";
import shoppingIcon from '../assets/img/online-shopping.png';
import billetera from '../assets/img/billetera.png';
import fastdelivery from '../assets/img/fast-delivery.png';

const pasos = [
  {
    icon: shoppingIcon,
    paso: "1. Explora y elige",
    descripcion: "Explora nuestros productos en línea y selecciona lo que necesites.",
  },
  {
    icon: billetera,
    paso: "2. Haz tu pedido",
    descripcion: "En el momento de la compra, elige tu método de pago y envío preferido.",
  },
  {
    icon: fastdelivery,
    paso: "3. Preparación y entrega veloz",
    descripcion: "Nos encargamos de preparar y enviar tu pedido lo antes posible.",
  },
];

const ComoFuncionamos = ({ beneficiosRef, beneficiosVisible }) => {
  return (
    <motion.div
      ref={beneficiosRef}
      initial={{ opacity: 0, y: 50 }}
      animate={beneficiosVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      onAnimationComplete={() => {
        const swiperEl = document.querySelector(".swiper")?.swiper;
        swiperEl?.update();
        swiperEl?.autoplay.start();
      }}
    >
      <Container>
        <Typography 
          variant="h4" 
          gutterBottom
          fontFamily={"Iceland"}
          textAlign="center"
          sx={{
            color: "#000"
          }}
        >
          ¿Cómo funcionamos?
        </Typography>

        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={6} 
          justifyContent="center" 
          alignItems="center"
          mt={4}
        >
          {pasos.map((item, index) => (
            <Stack 
              key={index} 
              spacing={2} 
              alignItems="center" 
              sx={{ maxWidth: 250, textAlign: "center" }}
            >
              <Box
                component="img"
                src={item.icon}
                alt={item.paso}
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.15)",
                  },
                }}
              />
              <Typography variant="h6" fontFamily="Caprasimo" sx={{color: "#000"}}>
                {item.paso}
              </Typography>
              <Typography variant="body1" sx={{color: "#000"}}>
                {item.descripcion}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Container>
    </motion.div>
  );
};

export default ComoFuncionamos;
