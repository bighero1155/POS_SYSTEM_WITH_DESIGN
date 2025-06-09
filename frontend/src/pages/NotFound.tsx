import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="container-fluid align-items-center bg-light min-vh-100">
      <h1>404 - Page Not Found</h1>
      <Link to="/" className="btn btn-primary mt-3">
        Go Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
