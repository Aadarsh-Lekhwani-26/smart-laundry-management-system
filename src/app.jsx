
import { useState } from "react";
import NewOrder from "./NewOrder.jsx";
import { prepareOrder } from "./orderUtils.js";

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

function OrdersPage({ orders, onCreateOrder }) {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  function handleSubmit(details) {
    const result = onCreateOrder(details);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setShowForm(false);
  }

  if (showForm) {
    return (
      <NewOrder
        onCancel={() => {
          setErrors({});
          setShowForm(false);
        }}
        onSubmit={handleSubmit}
        errors={errors}
      />
    );
  }

  return (
    <>
      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Order Management</h2>
            <p>Create and manage customer laundry orders.</p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            + New Order
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▤</div>
            <h3>No orders yet</h3>
            <p>Create your first order to get started.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-list-item" key={order.id}>
                <div>
                  <strong>{order.customerName}</strong>
                  <p>{order.id} · {order.phone}</p>
                  <p>
                    {order.garments.reduce(
                      (total, garment) => total + garment.quantity,
                      0
                    )}{" "}
                    garments · Delivery: {order.deliveryDate}
                  </p>
                </div>

                <span className="order-status">{order.status}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [orders, setOrders] = useState([]);

  const currentPage = navigation.find(
    (item) => item.id === activePage
  );

  function handleCreateOrder(details) {
    const result = prepareOrder(details, orders);

    if (!result.success) {
      return result;
    }

    setOrders((previousOrders) => [
      result.order,
      ...previousOrders,
    ]);

    return result;
  }

  function renderPage() {
    switch (activePage) {
      case "orders":
        return (
          <OrdersPage
            orders={orders}
            onCreateOrder={handleCreateOrder}
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
