import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/product-detail.css";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return null;

  return (
    <main className="product-detail-page">
      <div className="detail-card">
        <div className="breadcrumb">
            <span
                className="breadcrumb-link"
                onClick={() => navigate("/customer/products")}
            >
                Go back to Products
            </span>

            <span className="breadcrumb-sep">/</span>

            <span className="breadcrumb-category">
                {product.category.replaceAll("_", " ")}
            </span>
        </div>

        {/* IMAGE */}
        <div className="detail-image">
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
            onClick={() => setZoomOpen(true)}
          />
          <span className="zoom-hint">Tap to zoom</span>
        </div>

        {/* INFO */}
        <div className="detail-info">
          <span className="detail-category">
            {product.category.replaceAll("_", " ")}
          </span>

          <h1>{product.name}</h1>

          <span
            className={`stock-badge ${
              product.inStock ? "in-stock" : "out-stock"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>

          <p className="detail-description">
            {product.description || "No description available."}
          </p>

          {!product.contactAllowed && (
            <div className="detail-price">₹ {product.unitPrice}</div>
          )}

          {product.contactAllowed && (
            <a
              href={product.whatsappLink}
              target="_blank"
              className="product-whatsapp-btn"
            >
              Chat with Business
            </a>
          )}
        </div>
      </div>

      {/* IMAGE ZOOM MODAL */}
      {zoomOpen && (
        <div className="image-modal" onClick={() => setZoomOpen(false)}>
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
          />
        </div>
      )}
    </main>
  );
};

export default ProductDetail;
