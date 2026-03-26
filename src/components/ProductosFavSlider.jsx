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
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    speed={800}
                    breakpoints={{
                        0: {
                            slidesPerView: 1.3,
                            spaceBetween: 20,
                        },
                        600: {
                            slidesPerView: 2.3,
                            spaceBetween: 30,
                        },
                        900: {
                            slidesPerView: 3.5,
                            spaceBetween: 40,
                        }
                    }}
                    style={{ 
                        paddingTop: "20px",
                        paddingBottom: "40px",
                        paddingLeft: "15px", 
                        paddingRight: "15px" 
                    }}
                    // style={{ 
                    //     paddingTop: "20px",
                    //     paddingBottom: "20px",
                    //     paddingLeft: "10px", 
                    //     paddingRight: "10px" 
                    // }}
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