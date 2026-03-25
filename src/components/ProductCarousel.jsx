import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const ProductCarousel = ({ producto }) => {
    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1.2}
            centeredSlides={true}
            navigation
            pagination={{ clickable: true }}
            style={{ borderRadius: "12px" }}
        >
            {producto.imagenes.map((img, idx) => (
                <SwiperSlide key={idx}>
                    <img
                        src={img}
                        alt={producto.nombre}
                        style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "contain",
                            borderRadius: "12px",
                        }}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
export default ProductCarousel;