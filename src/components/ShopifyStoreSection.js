'use client'
import React from "react";

const ShopifyStoreSection = () => {
  const products = [
    {
      name: "Axis Y Dark spot Correcting Serum",
      price: "AED42.99",
      image: "/images/axisy.jpg", // Adjust path as needed
      description: "Niacinamide and tranexamic acid serum for dark spots"
    },
    {
      name: "CeraVe Moisturizer",
      price: "AED38.50",
      image: "/images/cerave.jpg", // Adjust path as needed
      description: "Lightweight daily moisturizer"
    },
    {
      name: "Cetaphil Gentle Skin Cleanser",
      price: "AED29.99",
      image: "/images/cetaphil.jpg", // Adjust path as needed
      description: "Deep hydrating face mask"
    }
  ];

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "4rem 2rem",
        margin: "3rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "1rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Desert Traders Store
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "2rem",
              maxWidth: "600px",
              margin: "0 auto 2rem auto",
              lineHeight: "1.6",
            }}
          >
            Premium skincare products inspired by the resilience of desert botanicals. 
            Experience natural beauty solutions crafted for modern wellness.
          </p>
        </div>

        {/* Website Preview Mockup */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "3rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            transform: "perspective(1000px) rotateX(5deg)",
            transition: "transform 0.3s ease",
          }}
        >
          {/* Browser Bar Mockup */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px 8px 0 0",
              marginBottom: "1rem",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem", marginRight: "1rem" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f57" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#28ca42" }} />
            </div>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                padding: "0.25rem 1rem",
                fontSize: "0.9rem",
                color: "#666",
                border: "1px solid #ddd",
                flex: 1,
                maxWidth: "300px",
              }}
            >
              deserttradersllc.com
            </div>
          </div>

          {/* Website Content Preview */}
          <div style={{ padding: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
                padding: "1rem",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                🌵 Desert Traders
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", color: "#666" }}>Shop</span>
                <span style={{ fontSize: "0.9rem", color: "#666" }}>About</span>
                <div
                  style={{
                    backgroundColor: "#667eea",
                    color: "white",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                  }}
                >
                  Cart (0)
                </div>
              </div>
            </div>

            {/* Featured Products Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {products.map((product, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "1rem",
                    border: "1px solid #e8e8e8",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
   <img
  src={product.image}
  alt={product.name}
  style={{
    width: "100%",
    aspectRatio: "1 / 1", // keeps it perfectly square
    objectFit: "cover", // crops extra if needed but keeps center
    borderRadius: "12px",
    marginBottom: "1rem",
    backgroundColor: "#f9f9f9",
    border: "1px solid #eee"
  }}
/>


                  <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#333" }}>
                    {product.name}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.75rem" }}>
                    {product.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#667eea" }}>
                      {product.price}
                    </span>
                    <div
                      style={{
                        backgroundColor: "#667eea",
                        color: "white",
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      Add to Cart
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "1rem 2rem",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "#ffffff", fontSize: "0.9rem" }}>✨ Free shipping on orders over AED50</span>
              <span style={{ color: "#ffffff", fontSize: "0.9rem" }}>🌱 100% Natural ingredients</span>
            </div>
          </div>

          <a
            href="https://deserttradersllc.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem 2.5rem",
              backgroundColor: "#ffffff",
              color: "#667eea",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "1.1rem",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              border: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 35px rgba(0,0,0,0.2)";
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#ffffff";
              e.target.style.border = "2px solid #ffffff";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.color = "#667eea";
              e.target.style.border = "2px solid transparent";
            }}
          >
            <span>Explore Our Store</span>
            <span style={{ fontSize: "1.2rem" }}>→</span>
          </a>

          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              marginTop: "1rem",
              fontStyle: "italic",
            }}
          >
            Join thousands of satisfied customers on their skincare journey
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShopifyStoreSection;