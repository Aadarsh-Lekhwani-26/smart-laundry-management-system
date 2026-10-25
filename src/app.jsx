
import { useEffect, useState } from "react";
import NewOrder from "./NewOrder.jsx";
import {
  prepareOrder,
  getNextOrderStatus,
  updateOrderStatus
} from "./orderUtils.js";



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

function Dashboard({ orders }) {
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
          value={orders.length}
          description="All recorded orders"
          icon="▤"
        />

        <StatCard
          label="In progress"
          value={
            orders.filter((order) =>
              ["Washing", "Ironing"].includes(order.status)
            ).length
          }
          description="Orders being processed"
          icon="◷"
        />

        <StatCard
          label="Ready for delivery"
          value={
            orders.filter(
              (order) => order.status === "Ready for Delivery"
            ).length
          }
          description="Awaiting delivery"
          icon="↗"
        />

        <StatCard
          label="Garment alerts"
          value="0"
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
          <span className="coming-soon">RECENT ACTIVITY</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▤</div>
            <h3>No orders yet</h3>
            <p>Create your first order to get started.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.slice(0, 5).map((order) => (
              <article className="order-list-item" key={order.id}>
                <div>
                  <strong>{order.customerName}</strong>
                  <p>
                    {order.id} · {order.phone}
                  </p>
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

function OrdersPage({
    orders,
    onCreateOrder,
    onAdvanceOrderStatus,
  }) {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  //----------------searching orders
  const filteredOrders = orders.filter((order) => {
  const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      order.customerName.toLowerCase().includes(query) ||
      order.phone.includes(query) ||
      order.id.toLowerCase().includes(query)
    );
  });
  //---------------------------------------e

  async function handleSubmit(details) {
    const result = await onCreateOrder(details);

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
        <div className="order-search">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>

          <input
            type="search"
            aria-label="Search orders"
            placeholder="Search by customer name, phone, or order ID..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          {searchQuery && (
            <button
              type="button"
              className="clear-search-button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▤</div>
            <h3>{orders.length === 0 ? "No orders yet" : "No matching orders"}</h3>
            <p>
              {orders.length === 0
                ? "Create your first order to get started."
                : "Try another customer name, phone number, or order ID."}
            </p>
          </div>
        ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
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

                  <div className="order-actions">
                    <span className="order-status">{order.status}</span>

                    {getNextOrderStatus(order.status) && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => onAdvanceOrderStatus(order.id)}
                      >
                        Move to {getNextOrderStatus(order.status)}
                      </button>
                    )}
                  </div>
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
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSavedOrders() {
      try {
        const savedOrders = await window.laundryApp.loadOrders();

        if (!Array.isArray(savedOrders)) {
          throw new Error("The saved orders data is invalid.");
        }

        if (isMounted) {
          setOrders(savedOrders);
          setStorageError("");
        }
      } catch (error) {
        console.error("Failed to load orders:", error);

        if (isMounted) {
          setStorageError(
            "Could not load saved orders. Please restart the app or check its local storage."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSavedOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentPage = navigation.find(
    (item) => item.id === activePage
  );

  async function handleCreateOrder(details) {
    const result = prepareOrder(details, orders);

    if (!result.success) {
      return result;
    }

    const updatedOrders = [result.order, ...orders];

    try {
      await window.laundryApp.saveOrders(updatedOrders);

      setOrders(updatedOrders);
      setStorageError("");

      return result;
    } catch (error) {
      console.error("Failed to save order:", error);

      setStorageError(
        "The order could not be saved. Please try again."
      );

      return {
        success: false,
        errors: {
          general:
            "Unable to save this order. Your existing orders have not been changed. Please try again.",
        },
      };
    }
  }
  //---------------------- status-change handler ------------------------------
  
  async function handleAdvanceOrderStatus(orderId) {
    const currentOrder = orders.find((order) => order.id === orderId);

    if (!currentOrder) {
      return;
    }

    const nextStatus = getNextOrderStatus(currentOrder.status);

    if (!nextStatus) {
      return;
    }

    const result = updateOrderStatus(currentOrder, nextStatus);

    if (!result.success) {
      return;
    }

    const updatedOrders = orders.map((order) =>
      order.id === orderId ? result.order : order
    );

    try {
      await window.laundryApp.saveOrders(updatedOrders);
      setOrders(updatedOrders);
      setStorageError("");
    } catch (error) {
      console.error("Failed to update order status:", error);
      setStorageError(
        "Could not save the status update. Please try again."
      );
    }
  } 
  //----------------------------------------------------
  function renderPage() {
    if (isLoading) {
      return (
        <section className="content-card">
          <h3>Loading orders...</h3>
          <p>Please wait while your saved orders are retrieved.</p>
        </section>
      );
    }

    if (activePage === "orders") {
      return (
        <OrdersPage
          orders={orders}
          onCreateOrder={handleCreateOrder}
          onAdvanceOrderStatus={handleAdvanceOrderStatus}
        />
      );
    }

    if (activePage === "pricing") {
      return (
        <PlaceholderPage
          title="Transparent Pricing"
          description="Manage washing and ironing prices and calculate bills."
        />
      );
    }

    if (activePage === "garments") {
      return (
        <PlaceholderPage
          title="Garment Tracking"
          description="Track garment quantities and identify discrepancies."
        />
      );
    }

    return <Dashboard orders={orders} />;
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

        {storageError && (
          <div
            role="alert"
            style={{
              margin: "16px 24px 0",
              padding: "12px 16px",
              border: "1px solid #e5a4a4",
              borderRadius: "8px",
              background: "#fff1f1",
              color: "#922b2b",
            }}
          >
            {storageError}
          </div>
        )}

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
