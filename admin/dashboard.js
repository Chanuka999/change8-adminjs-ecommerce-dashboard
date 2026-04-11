import React from "react";

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("/admin/api/dashboard")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);
  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Admin Dashboard</h1>
      <p>Welcome to Change8 Admin Panel</p>

      <div>
        <h3>Summary</h3>
        <ul>
          <p>Total Users: {data.users}</p>
          <p>Total Orders: {data.orders}</p>
          <p>Total Products: {data.products}</p>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
