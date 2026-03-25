import { Container, Typography, Stack, Fab } from "@mui/material";
import { motion } from "framer-motion";
import "../css/Home.css"
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import PlaceIcon from '@mui/icons-material/Place';

const ContactSection = ({redesRef, redesVisible}) => {
    const whaMessage = "Hola :) \nMe interesa realizar un pedido. \n¿Podrían darme más información?";
    // const whaMessage = `
    //         Hola :)
    //         Me interesa realizar un pedido.
    //         ¿Podrían darme más información?
    //     `;
    const phone = "5215644889629";
    const message4Wha = encodeURIComponent(whaMessage);
    const waLink = `https://wa.me/${phone}?text=${message4Wha}`;

    return (
        <motion.div
            ref={redesRef}
            initial={{ opacity: 0, y: 80 }}
            animate={redesVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            sx={{
                mt: 10,
                py: 6,
                textAlign: "center",
                borderRadius: 3,
            }}
        >
            <Container>
                <Typography 
                    variant="h4" 
                    gutterBottom
                    fontFamily={"Iceland"}
                    textAlign="center"
                    sx={{color: "#000"}}
                >
                    Contáctanos
                </Typography>

                <Typography textAlign="center" variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Síguenos para enterarte de promociones, novedades e información sobre nuestros productos <br/>
                </Typography>

                <Stack
                    direction="row"
                    spacing={3}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ flexWrap: "wrap", mb: 1 }}
                >
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <InstagramIcon sx={{color: "#008080", width: 40, height: 40}}/>
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <FacebookIcon sx={{color: "#1877F2", width: 40, height: 40}} />
                    </a>
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon sx={{color: "#27d045", width: 40, height: 40}} />
                    </a>
                    {/* <a href="mailto:contacto@vstore.com">
                        <img src="/img/icons/email.svg" alt="Correo" width={40} /> 
                    </a> */}
                </Stack>

                <Stack spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                        <PermPhoneMsgIcon color="error" /> +52 56 4488 9629
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                        ✉️ contacto@vstore.com
                    </Typography> */}
                    <Typography variant="body2" color="text.secondary">
                        <PlaceIcon color="error" /> CDMX, México
                    </Typography>
                </Stack>
            </Container>
        </motion.div>
    );
};

export default ContactSection;