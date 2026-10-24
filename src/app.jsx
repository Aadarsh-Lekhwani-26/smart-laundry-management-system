
import { useState } from "react";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "◫" },
  { id: "orders", label: "Orders", icon: "▤" },
  { id: "pricing", label: "Pricing", icon: "₹" },
  { id: "garments", label: "Garment Tracking", icon: "♧" },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">S</div>
        <div>
          <h2>Smart Laundry</h2>
          <p>MANAGEMENT SYSTEM</p>
        </div>
      </div>

      <p className="nav-heading">WORKSPACE</p>

      <nav className="navigation">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-indicator" />
        <div>
          <strong>Local workspace</strong>
          <p>Desktop application</p>
        </div>
      </div>
    </aside>
  );
}

function Dashboard() {
  return (
    <>
      <div className="welcome-banner">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h2>Welcome to Smart Laundry</h2>
          <p>
            Manage orders, simplify billing, and keep every
            garment accounted for.
          </p>
        </div>
        <div className="banner-icon">♧</div>
      </div>

      <section className="stats-grid">
        <StatCard
          label="Total orders"
          value="—"
          description="All recorded orders"
          icon="▤"
        />
        <StatCard
          label="In progress"
          value="—"
          description="Orders being processed"
          icon="◷"
        />
        <StatCard
          label="Ready for delivery"
          value="—"
          description="Awaiting delivery"
          icon="↗"
        />
        <StatCard
          label="Garment alerts"
          value="—"
          description="Discrepancies to review"
          icon="!"
        />
      </section>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h3>Recent orders</h3>
            <p>Your latest laundry activity will appear here.</p>
          </div>
          <span className="coming-soon">UPCOMING</span>
        </div>

        <div className="empty-state">
          <div className="empty-icon">▤</div>
          <h3>No orders yet</h3>
          <p>
            Orders will appear here once order management is
            implemented.
          </p>
        </div>
      </section>
    </>
  );
}

function StatCard({ label, value, description, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <p>{description}</p>
    </article>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <section className="content-card placeholder-page">
      <div className="empty-icon">◈</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="coming-soon">PLANNED FEATURE</span>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const currentPage = navigation.find(
    (item) => item.id === activePage
  );

  function renderPage() {
    switch (activePage) {
      case "orders":
        return (
          <PlaceholderPage
            title="Order Management"
            description="Create, update, search, and track laundry orders."
          />
        );
      case "pricing":
        return (
          <PlaceholderPage
            title="Transparent Pricing"
            description="Manage washing and ironing prices and calculate bills."
          />
        );
      case "garments":
        return (
          <PlaceholderPage
            title="Garment Tracking"
            description="Track garment quantities and identify discrepancies."
          />
        );
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace /</p>
            <h1>{currentPage.label}</h1>
          </div>
          <div className="user-badge">
            <span className="user-avatar">SL</span>
            <div>
              <strong>Laundry Admin</strong>
              <p>Local workspace</p>
            </div>
          </div>
        </header>

        <div className="page-content">{renderPage()}</div>

        <footer className="app-footer">
          <span>Smart Laundry Management System</span>
          <span>Local desktop application</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
