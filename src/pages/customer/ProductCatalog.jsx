import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/product-catalog.css";
import { useNavigate } from "react-router-dom";

const PRICE_CATEGORIES = ["SPARE_PARTS", "ACCESSORIES", "OIL"];
const CONTACT_CATEGORIES = [
  "MOTORS",
  "SEWING_MACHINE_TOP",
  "STAND",
  "TABLE",
];

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    api.get("/api/products") // public later, admin for now
      .then(res => setProducts(res.data));
  }, []);

  const getImageUrl = (imageUrl) =>
    imageUrlpro
      ? `http://localhost:8080${imageUrl}`
      : "/placeholder.png";

  return (
    <main className="catalog-page">

      {/* HERO */}
      {/* CATALOG HEADER */}
      <section className="catalog-header">
        <div className="catalog-header-content">
          <h1>
            <span>Explore Our Products</span>
          </h1>

          <p>
            Sewing machines, motors, spare parts, and tailoring accessories —
            selected for quality and durability.
          </p>
        </div>

        {/* HEADER RIBBON */}
        <div className="catalog-ribbon">
          <a href="/customer" className="ribbon-link">
            Home
          </a>

          <select
            className="ribbon-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="SPARE_PARTS">Spare Parts</option>
            <option value="ACCESSORIES">Accessories</option>
            <option value="OIL">Oil</option>
            <option value="MOTORS">Motors</option>
            <option value="SEWING_MACHINE_TOP">Machine Top</option>
            <option value="STAND">Stand</option>
            <option value="TABLE">Table</option>
          </select>

          <input
            type="text"
            className="ribbon-search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </section>


      {/* GRID */}
      <section className="catalog-grid">
        {products
          .filter(product => {
            const matchesCategory =
              !category || product.category === category;

            const matchesSearch =
              product.name.toLowerCase().includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
          })
          .map(product => (

          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/customer/products/${product.id}`)}
          >

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
                  {product.contactAllowed && (
                    <a
                      href={product.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="product-whatsapp-btn"
                    >
                      Chat with Business
                    </a>
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
