import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAllUsers,
  deleteUser,
  addUser,
  updateUser,
} from "../../services/userService";
import ErrorHandler from "../ErrorHandler";
import { UserFormData, FieldErrors } from "../../Errors/UserFieldErrors";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<Omit<UserFormData, "user_id">>({
    first_name: "",
    middle_name: "",
    last_name: "",
    age: "",
    address: "",
    contact_number: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const validateForm = (
    formData: UserFormData,
    isEditing: boolean
  ): FieldErrors => {
    const errors: FieldErrors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    }

    if (
      !formData.age ||
      parseInt(formData.age) < 1 ||
      parseInt(formData.age) > 120
    ) {
      errors.age = "Age must be between 1 and 120";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!formData.contact_number.trim()) {
      errors.contact_number = "Contact number is required";
    } else {
      const existingUser = users.find(
        (user) =>
          user.contact_number === formData.contact_number &&
          user.user_id !== formData.user_id
      );
      if (existingUser) {
        errors.contact_number = "This contact number is already registered";
      }

      const phonePattern = /^[0-9+\-\s()]+$/;
      if (!phonePattern.test(formData.contact_number)) {
        errors.contact_number = "Please enter a valid contact number";
      }
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const existingUser = users.find(
        (user) =>
          user.email.toLowerCase() === formData.email.toLowerCase() &&
          user.user_id !== formData.user_id
      );
      if (existingUser) {
        errors.email = "This email is already registered";
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    if (!isEditing || formData.password.trim()) {
      if (!formData.password.trim()) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      } else if (formData.password.length > 15) {
        errors.password = "Password must not exceed 15 characters";
      }
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    return errors;
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      handleApiError(err, "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err: any, defaultMessage: string) => {
    if (err.response?.status === 401) {
      setError("Your session has expired. Please login again.");
    } else if (err.response?.status === 403) {
      setError("You don't have permission to perform this action.");
    } else if (err.response?.status === 404) {
      setError("The requested resource was not found.");
    } else if (err.response?.status === 409) {
      setError("A conflict occurred. The data may already exist.");
    } else if (err.response?.status === 422) {
      setError("The submitted data is invalid. Please check your input.");
    } else if (err.response?.status >= 500) {
      setError("Server error occurred. Please try again later.");
    } else if (err.code === "NETWORK_ERROR" || !err.response) {
      setError("Network error. Please check your connection and try again.");
    } else {
      setError(defaultMessage);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  };

  const clearForm = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      age: "",
      address: "",
      contact_number: "",
      email: "",
      password: "",
      role: "cashier",
    });
    setFieldErrors({});
    setEditingUserId(null);
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== userId)
      );
      setSuccess(`User "${userName}" successfully deleted.`);
    } catch (err: any) {
      console.error("Error deleting user:", err);

      if (err.response?.status === 404) {
        setError("User not found. It may have already been deleted.");
        fetchUsers();
      } else {
        handleApiError(err, `Failed to delete user "${userName}".`);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }

    if (error || success) {
      setError(null);
      setSuccess(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const formDataWithId = {
      ...formData,
      user_id: editingUserId || 0,
    } as UserFormData;

    const validationErrors = validateForm(formDataWithId, !!editingUserId);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Please fix the errors below before submitting.");
      return;
    }

    setSubmitLoading(true);

    try {
      if (editingUserId) {
        const updatedUser = await updateUser(editingUserId, formData);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === editingUserId ? { ...user, ...updatedUser } : user
          )
        );

        setSuccess(
          `User "${formData.first_name} ${formData.last_name}" updated successfully.`
        );
        clearForm();
      } else {
        const newUser = await addUser(formData);

        if (newUser && newUser.user_id) {
          setUsers((prevUsers) => [...prevUsers, newUser]);
        } else {
          await fetchUsers();
        }

        setSuccess(
          `User "${formData.first_name} ${formData.last_name}" added successfully.`
        );
        clearForm();
      }
    } catch (err: any) {
      console.error("Error submitting user:", err);

      if (err.response?.status === 409) {
        const errorMessage =
          err.response?.data?.message || "Data conflict occurred";
        if (errorMessage.toLowerCase().includes("email")) {
          setFieldErrors({ email: "This email is already registered." });
          setError("Email already exists. Please use a different email.");
        } else if (
          errorMessage.toLowerCase().includes("contact") ||
          errorMessage.toLowerCase().includes("phone")
        ) {
          setFieldErrors({
            contact_number: "This contact number is already registered.",
          });
          setError(
            "Contact number already exists. Please use a different number."
          );
        } else {
          setError(errorMessage);
        }
      } else if (err.response?.status === 422) {
        const serverErrors = err.response.data?.errors || {};
        setFieldErrors(serverErrors);
        setError("Please fix the validation errors and try again.");
      } else {
        const action = editingUserId ? "update" : "add";
        handleApiError(err, `Failed to ${action} user. Please try again.`);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUserId(user.user_id);
    setFormData({
      first_name: user.first_name || "",
      middle_name: user.middle_name || "",
      last_name: user.last_name || "",
      age: user.age?.toString() || "",
      address: user.address || "",
      contact_number: user.contact_number || "",
      email: user.email || "",
      password: "",
      role: user.role || "cashier",
    });
    clearMessages();
  };

  const handleCancelEdit = () => {
    clearForm();
    clearMessages();
  };

  const getInputClass = (field: string) =>
    `form-control ${fieldErrors[field] ? "is-invalid" : ""}`;

  const getSelectClass = (field: string) =>
    `form-select ${fieldErrors[field] ? "is-invalid" : ""}`;

  if (loading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <style>
        {`
          .card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
          }
          
          .btn-primary {
            background-color: #8B5A2B;
            border-color: #8B5A2B;
          }
          
          .btn-primary:hover {
            background-color: #6F4E37;
            border-color: #6F4E37;
          }
          
          .btn-warning {
            background-color: #D2B48C;
            border-color: #D2B48C;
            color: #fff;
          }
          
          .btn-warning:hover {
            background-color: #C19A6B;
            border-color: #C19A6B;
          }
          
          .table-primary {
            background-color: #F5DEB3;
          }
          
          .badge.bg-primary {
            background-color: #8B5A2B !important;
          }
          
          .badge.bg-success {
            background-color: #6B8E23 !important;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #D2B48C;
            box-shadow: 0 0 0 0.25rem rgba(210, 180, 140, 0.25);
          }
          
          .invalid-feedback {
            color: #dc3545;
          }
          
          .text-primary {
            color: #8B5A2B !important;
          }
          
          .alert-info {
            background-color: #F5DEB3;
            border-color: #D2B48C;
            color: #6F4E37;
          }
        `}
      </style>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div
            className="card shadow-sm p-4 mb-4"
            style={{ backgroundColor: "#FFF8DC" }}
          >
            <div className="d-flex justify-content-center align-items-center mb-4 gap-3">
              <h3 className="mb-0 text-brown text-center">
                {editingUserId ? "Edit User" : "Add User"}
                <small className="text-muted d-block fs-6">
                  {editingUserId
                    ? "Update existing user details"
                    : "Add a new user to the system"}
                </small>
              </h3>
              {editingUserId && (
                <button
                  className="btn btn-outline-brown btn-sm"
                  onClick={handleCancelEdit}
                  type="button"
                  style={{ borderColor: "#8B5A2B", color: "#8B5A2B" }}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancel Edit
                </button>
              )}
            </div>

            <ErrorHandler
              message={error}
              type="error"
              clearMessage={clearMessages}
            />
            <ErrorHandler
              message={success}
              type="success"
              clearMessage={clearMessages}
            />

            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <label
                  htmlFor="first_name"
                  className="form-label small text-muted"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={getInputClass("first_name")}
                  disabled={submitLoading}
                />
                {fieldErrors.first_name && (
                  <div className="invalid-feedback">
                    {fieldErrors.first_name}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  htmlFor="middle_name"
                  className="form-label small text-muted"
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middle_name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="form-control"
                  disabled={submitLoading}
                />
              </div>

              <div className="col-md-4">
                <label
                  htmlFor="last_name"
                  className="form-label small text-muted"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={getInputClass("last_name")}
                  disabled={submitLoading}
                />
                {fieldErrors.last_name && (
                  <div className="invalid-feedback">
                    {fieldErrors.last_name}
                  </div>
                )}
              </div>

              <div className="col-md-3">
                <label htmlFor="age" className="form-label small text-muted">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={getInputClass("age")}
                  min="1"
                  max="120"
                  disabled={submitLoading}
                />
                {fieldErrors.age && (
                  <div className="invalid-feedback">{fieldErrors.age}</div>
                )}
              </div>

              <div className="col-md-9">
                <label
                  htmlFor="address"
                  className="form-label small text-muted"
                >
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={getInputClass("address")}
                  disabled={submitLoading}
                />
                {fieldErrors.address && (
                  <div className="invalid-feedback">{fieldErrors.address}</div>
                )}
              </div>

              <div className="col-md-6">
                <label
                  htmlFor="contact_number"
                  className="form-label small text-muted"
                >
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  className={getInputClass("contact_number")}
                  disabled={submitLoading}
                />
                {fieldErrors.contact_number && (
                  <div className="invalid-feedback">
                    {fieldErrors.contact_number}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <label htmlFor="email" className="form-label small text-muted">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClass("email")}
                  disabled={submitLoading}
                />
                {fieldErrors.email && (
                  <div className="invalid-feedback">{fieldErrors.email}</div>
                )}
              </div>

              <div className="col-md-6">
                <label
                  htmlFor="password"
                  className="form-label small text-muted"
                >
                  {editingUserId ? "New Password" : "Password *"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editingUserId
                      ? "Leave blank to keep current"
                      : "8-15 characters"
                  }
                  className={getInputClass("password")}
                  disabled={submitLoading}
                  minLength={8}
                  maxLength={15}
                />
                {fieldErrors.password && (
                  <div className="invalid-feedback">{fieldErrors.password}</div>
                )}
                <div className="form-text small">
                  {!editingUserId
                    ? "Password must be 8-15 characters long"
                    : "Leave blank to keep current password"}
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="role" className="form-label small text-muted">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={getSelectClass("role")}
                  disabled={submitLoading}
                >
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                </select>
                {fieldErrors.role && (
                  <div className="invalid-feedback">{fieldErrors.role}</div>
                )}
              </div>

              <div className="col-12 mt-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </span>
                      {editingUserId ? "Updating..." : "Adding..."}
                    </>
                  ) : editingUserId ? (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Update User
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Add User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div
            className="card shadow-sm p-4"
            style={{ backgroundColor: "#FFF8DC" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-brown mb-0">
                <i className="bi bi-people-fill me-2"></i>
                User List
                <span className="badge bg-brown ms-2">
                  {users.filter((user) => user.role !== "admin").length}
                </span>
              </h5>
              <button
                className="btn btn-outline-brown btn-sm"
                onClick={fetchUsers}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>

            {users.length === 0 ? (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                No users found. Add your first user above.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th style={{ width: "25%" }}>Name</th>
                      <th style={{ width: "25%" }}>Email</th>
                      <th style={{ width: "15%" }}>Contact</th>
                      <th style={{ width: "15%" }}>Role</th>
                      <th style={{ width: "20%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((user) => user.role !== "admin")
                      .map((user) => (
                        <tr key={user.user_id}>
                          <td>
                            <div>
                              <strong className="text-brown">
                                {user.first_name} {user.middle_name}{" "}
                                {user.last_name}
                              </strong>
                              {user.age && (
                                <small className="text-muted d-block">
                                  Age: {user.age}
                                </small>
                              )}
                              {user.address && (
                                <small
                                  className="text-muted d-block text-truncate"
                                  style={{ maxWidth: "200px" }}
                                >
                                  <i className="bi bi-geo-alt me-1"></i>
                                  {user.address}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <a
                              href={`mailto:${user.email}`}
                              className="text-decoration-none"
                            >
                              {user.email}
                            </a>
                          </td>
                          <td>
                            <a
                              href={`tel:${user.contact_number}`}
                              className="text-decoration-none"
                            >
                              {user.contact_number}
                            </a>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                user.role === "manager"
                                  ? "bg-success"
                                  : "bg-primary"
                              }`}
                            >
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-warning btn-sm flex-grow-1"
                                onClick={() => handleEdit(user)}
                                disabled={submitLoading}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm flex-grow-1"
                                onClick={() =>
                                  handleDelete(
                                    user.user_id,
                                    `${user.first_name} ${user.last_name}`
                                  )
                                }
                                disabled={submitLoading}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
