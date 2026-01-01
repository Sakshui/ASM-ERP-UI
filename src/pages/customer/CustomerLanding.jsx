import { useAuth } from "../../auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import "../../styles/customer-landing.css";
import { useNavigate } from "react-router-dom";

import shop1 from "../../assets/gemini2.png";
//import shop2 from "../../assets/sewing-machine.jpeg";

import "../../styles/customer-landing.css";

const CustomerLanding = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <main className="landing">

      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          {/*<div className="logo">Acharekar</div>*/}

          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="/customer/products">Products</a>
            <a href="/track-repair">Repairs</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* MENU ICON */}
          {user && (
            <div className="menu-wrapper" ref={menuRef}>
              <button
                className="menu-icon"
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Menu"
              >
                ☰
              </button>

              {menuOpen && (
              <div className="menu-dropdown">

                {/* MOBILE NAV LINKS */}
                <a href="#">Home</a>
                <a href="/customer/products">Products</a>
                <a href="/track-repair">Repairs</a>
                <a href="#contact">Contact</a>

                <div className="menu-divider"></div>

                {/* ACCOUNT ACTIONS */}
                <a href="/profile">My Profile</a>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Relax as you sew with <br />
            <span>Acharekar Sewing Machine</span>
          </h1>

          <p>
            Sewing machine sales and repair services and genuine spare parts,
            trusted by customers for over 30 years.
          </p>

          {!user && (
            <div className="hero-actions">
              <a href="/login" className="hero-btn">
                Login or Register
              </a>
            </div>
          )}

        {user && (
          <div className="hero-actions">
            <a href="#services" className="hero-btn">
              Explore Our Services
            </a>
          </div>
        )}


        </div>

        <div className="hero-visual">
          <img
          //src="https://png.pngtree.com/png-clipart/20210314/original/pngtree-flat-design-of-tailor-fashion-designer-png-image_6101332.jpg"
            //src={shop1}
            src="https://cdn.pixabay.com/photo/2024/06/03/20/50/ai-generated-8807316_960_720.png"
            alt="Sewing machine service"
          />
        </div>
      </section>
      


      {/* SERVICES */}
      <section className="services-section" id="services">
        <h2 className="section-title">
          Our Services
          <span className="section-subtitle">
            Everything you need for sewing, servicing, and support
          </span>
        </h2>


        <div className="services-grid">
          <div className="service-card">
            <h4>Machine & Motor Sales</h4>
            <p>
              New sewing machines, motors, and carefully inspected second-hand machines
              for reliable performance.
            </p>
          </div>

          <div className="service-card">
            <h4>Machine Repairs</h4>
            <p>
              Expert repair services for domestic and industrial sewing machines.
            </p>
          </div>

          <div className="service-card">
            <h4>Spare Parts & Accessories</h4>
            <p>
              Genuine spare parts and essential accessories for sewing machines and all tailoring needs.
            </p>
          </div>
        </div>
      </section>


      {/* LOCATION SECTION */}
      <section className="location-section">
        <div className="location-container">

          <div className="location-content">
            <h2>Visit Our Store</h2>
            <span className="location-badge">Since 1993</span>
            <p>
              Walk in for sewing machines, repairs, spare parts, and tailoring essentials.
            </p>

            <div className="location-meta">
              <span>📍 Ulhasnagar - 421004, Maharashtra</span>
              <span>🕒 Tue – Sun: 10:00 AM – 9:00 PM</span>
              <div className="location-actions">
                  <a
                    href="https://maps.google.com/?q=Achrekar Sewing Machine Ulhasnagar"
                    target="_blank"
                    className="loc-btn primary"
                  >
                    Get Directions
                  </a>

                  <a
                    href="https://wa.me/919822676202"
                    target="_blank"
                    className="loc-btn secondary"
                  >
                    WhatsApp Us
                  </a>
                </div>
            </div>
          </div>

          <div className="location-map">
            <div className="map-frame">
              <iframe
                title="map"
                loading="lazy"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.5980352192123!2d73.15951919999999!3d19.2127513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be79467daaaaabd%3A0x9887d7ffe2b9cb3b!2sAchrekar%20Sewing%20Machine!5e0!3m2!1sen!2sin!4v1766263552424!5m2!1sen!2sin"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE HIGHLIGHTS */}
      <section className="experience-section">
        <div className="experience-container">

          <div className="experience-item">
            <span className="experience-number">30+</span>
            <span className="experience-label">Years of Expertise</span>
          </div>

          <div className="experience-divider"></div>

          <div className="experience-item">
            <span className="experience-number">Trusted</span>
            <span className="experience-label">By Generations</span>
          </div>

          <div className="experience-divider"></div>

          <div className="experience-item">
            <span className="experience-number">100%</span>
            <span className="experience-label">Genuine Products & Honest Service</span>
          </div>

        </div>
      </section>


      {/* CTA */}
      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">

          {/* Brand / About */}
          <div className="footer-brand">
            <h3>Acharekar Sewing Machine Shop</h3>
            <p>
              Trusted sewing machine sales, repairs, spare parts, and tailoring support
              for over 30 years.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#">Home</a>
            <a href="#">Services</a>
            <a href="#">Repairs</a>
            <a href="#">Contact</a>
          </div>

          {/* Services */}
          <div className="footer-links">
            <h4>Our Services</h4>
            <span>Machine & Motor Sales</span>
            <span>Machine Repairs</span>
            <span>Spare Parts & basic Tailoring Accessories</span>
          </div>

          {/* Contact */}
          <div className="footer-contact" id="contact">
            <h4>Contact</h4>
            <p>📍 Ulhasnagar - 421004, Maharashtra</p>
            <p>📞 +91 98226 76202</p>
            <p>🕒 Tue – Sun: 10:00 AM – 9:00 PM</p>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Acharekar Sewing Machine. All rights reserved.
        </div>
      </footer>


    </main>
  );
};

export default CustomerLanding;
