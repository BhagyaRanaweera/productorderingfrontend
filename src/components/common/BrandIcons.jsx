// BrandIcons.jsx
import React from "react";
import { Box, Typography } from "@mui/material"; // MUI components
import AdidasIcon from "../../assets/brands/adidas.png";
import AppleIcon from "../../assets/brands/apple.png";
import SamsungIcon from "../../assets/brands/samsung.png";
import LushIcon from "../../assets/brands/lush.png";
import VirginIcon from "../../assets/brands/virgin.png";
import NikeIcon from "../../assets/brands/nike.png";
import SonyIcon from "../../assets/brands/sony.png";
import CocaColaIcon from "../../assets/brands/pandora.png";
import GoogleIcon from "../../assets/brands/damro.png";
import MicrosoftIcon from "../../assets/brands/emaraled.png";
import TeslaIcon from "../../assets/brands/dsi.png";
import AmazonIcon from "../../assets/brands/amoudi.png";
import McDonaldsIcon from "../../assets/brands/vivo.png";
import PepsiIcon from "../../assets/brands/tiger.png";
import FacebookIcon from "../../assets/brands/goldoo.png";
import NetflixIcon from "../../assets/brands/rolex.png";
import ToyotaIcon from "../../assets/brands/gif.png";
import HondaIcon from "../../assets/brands/avaito.png";
import StarbucksIcon from "../../assets/brands/given.png";

const brandImages = [
  { src: AdidasIcon, alt: "Adidas" },
  { src: AppleIcon, alt: "Apple" },
  { src: SamsungIcon, alt: "Samsung" },
  { src: LushIcon, alt: "Lush" },
  { src: VirginIcon, alt: "Virgin" },
  { src: NikeIcon, alt: "Nike" },
  { src: SonyIcon, alt: "Sony" },
  { src: CocaColaIcon, alt: "CocaCola" },
  { src: GoogleIcon, alt: "Google" },
  { src: MicrosoftIcon, alt: "Microsoft" },
  { src: TeslaIcon, alt: "Tesla" },
  { src: AmazonIcon, alt: "Amazon" },
  { src: McDonaldsIcon, alt: "McDonalds" },
  { src: PepsiIcon, alt: "Pepsi" },
  { src: FacebookIcon, alt: "Facebook" },
  { src: NetflixIcon, alt: "Netflix" },
  { src: ToyotaIcon, alt: "Toyota" },
  { src: HondaIcon, alt: "Honda" },
  { src: StarbucksIcon, alt: "Starbucks" },
];

const BrandIcons = () => {
  return (
    <Box className="my-8">
      <Typography variant="h4" align="center" gutterBottom>
        Brands
      </Typography>
      <div className="overflow-x-hidden relative">
        <div className="flex space-x-6 animate-scroll">
          {brandImages.map((brand, index) => (
            <img
              key={index}
              src={brand.src}
              alt={brand.alt}
              className="w-16 h-16 object-contain flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </Box>
  );
};

export default BrandIcons;
