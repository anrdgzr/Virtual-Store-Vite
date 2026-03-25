import { Grid, Box } from "@mui/material";

// const brands = [
//     { name: "WAKA", logo: "/img/marcas/waka_logo.svg" },
//     { name: "iplay", logo: "/img/marcas/iplay.svg" },
//     { name: "geekbar", logo: "/img/marcas/geekbar.svg" },
//     { name: "instabar", logo: "/img/marcas/instabar.webp" },
//     { name: "elux", logo: "/img/marcas/elux.svg" },
// ];

const BrandMosaic = ({brands}) => {
  const getImageUrl = (url) => url.replace("/raw/", "/image/");
  return (
    <Grid container spacing={4} justifyContent="center">
      {brands.map((brand, idx) => (
        <Grid item xs={6} md={2} key={idx}>
          <Box
            component="img"
            src={brand.imagenes ? getImageUrl(brand.imagenes[0]):null}
            alt={brand.name}
            sx={{
              width: "100%",
              maxWidth: 150,
              maxHeight: 150,
              objectFit: "contain",
              transition: "transform 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default BrandMosaic;