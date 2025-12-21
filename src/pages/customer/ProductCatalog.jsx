import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/product-catalog.css";

const PRICE_CATEGORIES = ["SPARE_PARTS", "ACCESSORIES", "OIL"];
const CONTACT_CATEGORIES = [
  "MOTORS",
  "SEWING_MACHINE_TOP",
  "STAND",
  "TABLE",
];

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/api/products") // public later, admin for now
      .then(res => setProducts(res.data));
  }, []);

  const getImageUrl = (imageUrl) =>
    imageUrl
      ? `http://localhost:8080${imageUrl}`
      : "/placeholder.png";

  return (
    <main className="catalog-page">

      {/* HERO */}
      <section className="catalog-hero">
        <h1>Our Products</h1>
        <p>
          Sewing machines, motors, spare parts, and tailoring accessories.
          Genuine products with reliable service.
        </p>
      </section>

      {/* GRID */}
      <section className="catalog-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">

              <img
                src={
                  product.imageUrl
                    ? `http://localhost:8080${product.imageUrl}`
                    : "/placeholder.png"
                }
                alt={product.name}
              />

              <div className="product-body">

                {/* Category */}
                <span className="product-category">
                  {product.category.replaceAll("_", " ")}
                </span>

                {/* Name */}
                <h3>{product.name}</h3>

                {/* Stock status */}
                <span
                  className={`stock-badge ${
                    product.inStock ? "in-stock" : "out-stock"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>

                {/* Footer */}
                <div className="product-footer">

                  {/* PRICE */}
                  {!product.contactAllowed && (
                    <span className="product-price">
                      ₹ {product.unitPrice}
                    </span>
                  )}

                  {/* CHAT WITH BUSINESS */}
                  {product.contactAllowed ? (
  <a
    href={product.whatsappLink}
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-btn"
  >
    Chat with Business
  </a>
) : (
  <span className="product-price">₹ {product.unitPrice}</span>
)}


                </div>
              </div>

            </div>

        ))}
      </section>

    </main>
  );
};

export default ProductCatalog;
