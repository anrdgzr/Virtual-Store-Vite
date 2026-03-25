import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Typography, Container } from "@mui/material";
import CardComponent from "./CardComponent";
import { useState } from "react";
import MoreInfoDialog from "./MoreInfoDialog";
import { motion } from "framer-motion";


const ProductosFavSlider = ({
    productos,
    productosRef,
    productosVisible
}) => {
    const [open, setOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    
    const handleOpen = (producto) => {
        setProductoSeleccionado(producto);
        setOpen(true);
    };

    const handleClose = () => {
        setProductoSeleccionado(null);
        setOpen(false);
    }
    return (
        <motion.div
            ref={productosRef}
            initial={{ opacity: 0, y: 50 }}
            animate={productosVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
        >
            <Container>
                <Typography 
                    variant="h4" 
                    gutterBottom
                    fontFamily={"Iceland"}
                    sx={{
                        textAlign: "center",
                        color: "#000"
                    }}
                >
                    Productos Destacados
                </Typography>

                <Swiper
                    modules={[Autoplay]}
                    slidesPerView={2}
                    spaceBetween={20}
                    loop={true}
                    autoplay={{
                        delay: 1,
                        disableOnInteraction: false,
                    }}
                    speed={3000}
                    style={{ 
                        paddingTop: "20px",
                        paddingBottom: "20px",
                        paddingLeft: "10px", 
                        paddingRight: "10px" 
                    }}
                >
                    {productos.map((producto) => (
                        <SwiperSlide 
                            key={producto.id}
                        >
                            <CardComponent
                                producto={producto}
                                handleOpen={handleOpen}
                                isHome={true}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <MoreInfoDialog
                    onClose={handleClose}
                    productoSeleccionado={productoSeleccionado}
                    open={open} 
                />
            </Container>
        </motion.div>
    );
}
export default ProductosFavSlider;