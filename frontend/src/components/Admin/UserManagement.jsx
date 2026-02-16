import React, { useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      _id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
    },
    {
      _id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Customer",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer", // Default role is Customer
  });

  const handleFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Customer",
    });
  };
  const handleRoleChange = (userId, newRole) => {
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user,
      ),
    );
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?"));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 ">User Management</h2>
      {/* New USer Form */}
      <div className="p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormData}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormData}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Password <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormData}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Role <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleFormData}
              required
              className="w-full p-2 border rounded"
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 cursor-pointer"
          >
            Add User
          </button>
        </form>
      </div>
      {/* All Users list */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className=" p-2 border rounded cursor-pointer"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 cursor-pointer"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-center text-gray-500" colSpan="4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
