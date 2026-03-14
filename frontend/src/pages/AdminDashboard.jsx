import { useEffect, useState } from "react";
import api from "../services/api";
import PageCard from "../components/PageCard";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [overview, setOverview] = useState({ users: 0, products: 0, orders: 0 });

  const wholesalers = users.filter((user) => user.role === "wholesaler");
  const shopkeepers = users.filter((user) => user.role === "shopkeeper");
  const customers = users.filter((user) => user.role === "customer");

  const load = async () => {
    const [usersRes, overviewRes] = await Promise.all([
      api.get("/users/admin/users"),
      api.get("/users/admin/overview"),
    ]);
    setUsers(usersRes.data);
    setOverview(overviewRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteUser = async (id) => {
    await api.delete(`/users/admin/users/${id}`);
    await load();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-5 gap-4">
        <PageCard title="Wholesalers">{wholesalers.length}</PageCard>
        <PageCard title="Shopkeepers">{shopkeepers.length}</PageCard>
        <PageCard title="Customers">{customers.length}</PageCard>
        <PageCard title="Total Products">{overview.products}</PageCard>
        <PageCard title="Total Orders">{overview.orders}</PageCard>
      </div>

      <PageCard title="Wholesalers">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wholesalers.map((u) => (
                <tr key={u._id} className="border-b">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>

      <PageCard title="Shopkeepers">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shopkeepers.map((u) => (
                <tr key={u._id} className="border-b">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>

      <PageCard title="Customers">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((u) => (
                <tr key={u._id} className="border-b">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>
    </div>
  );
}
