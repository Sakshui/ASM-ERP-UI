import "../styles/customer-header.css";

const CustomerHeader = () => {
  return (
    <header className="customer-header">
      <div className="header-content">
        <h2 className="brand">Acharekar Sewing</h2>

        <nav>
          <a href="#about">About</a>
          <a href="#faq">FAQs</a>
          <a href="/customer/repairs" className="primary-btn small">
            My Repairs
          </a>
        </nav>
      </div>
    </header>
  );
};

export default CustomerHeader;
