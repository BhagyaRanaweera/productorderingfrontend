import React from "react";
import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/website/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const FooterLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
  {
    title: "Blog",
    link: "https://www.siegemedia.com/strategy/business-blog-examples",
  },
];

const Footer = () => {
  return (
    <div style={BannerImg} className="text-white">
      <div className="container">
        <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-44 pt-5">
          {/* company details */}
          <div className="py-8 px-4">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
              <img src={footerLogo} alt="" className="max-w-[50px]" />
              ModishMart
            </h1>
            <p>Your One-Stop Shop for Everything You Love!</p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
            {/* Important Links */}
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Important Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <li
                      className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                      key={link.title}
                    >
                      <a href={link.link}>
                        <span>{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* About Section */}
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  About
                </h1>
                <p className="text-gray-200">
                  We are ModishMart, providing high-quality products to meet your needs. Our goal is to offer a one-stop shopping experience for all your essentials.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Contact Us
                </h1>
                <ul className="flex flex-col gap-3">
                  <li className="text-gray-200">
                    <FaLocationArrow className="inline-block" /> No.30, Lotus Road, Colombo 4
                  </li>
                  <li className="text-gray-200">
                    <FaMobileAlt className="inline-block" /> +94 123456789
                  </li>
                  <li className="text-gray-200">
                    <a href="mailto:info@modishmart.com">
                      <FaLinkedin className="inline-block" /> info@modishmart.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-3xl" />
              </a>
              <a href="https://www.facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-3xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
