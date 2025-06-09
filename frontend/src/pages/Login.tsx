import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes brownFade {
            0% {
              background: linear-gradient(135deg, #c7a17a, #8b5e3c);
            }
            25% {
              background: linear-gradient(135deg, #8b5e3c, #4b2e05);
            }
            50% {
              background: linear-gradient(135deg, #4b2e05, #3a1f00);
            }
            75% {
              background: linear-gradient(135deg, #a97458, #6b4a1c);
            }
            100% {
              background: linear-gradient(135deg, #c7a17a, #8b5e3c);
            }
          }
          .background-fade {
            animation: brownFade 20s ease infinite;
            background-size: 400% 400%;
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>

      <div className="background-fade">
        <div
          className="card p-4 shadow"
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#8b5e3c", // lighter brown card background
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(75, 46, 5, 0.6)",
            color: "#fff",
          }}
        >
          <h2 className="text-center mb-4" style={{ fontWeight: "700" }}>
            REKBRANEZ
          </h2>
          {error && (
            <div
              className="alert"
              role="alert"
              style={{
                backgroundColor: "#a97458", // medium brown alert bg
                color: "#3a1f00",
                border: "none",
                fontWeight: "600",
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label"
                style={{ color: "#f5f1e9" }} // off-white label
              >
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  backgroundColor: "#b89972", // light brown input bg
                  border: "1px solid #4b2e05",
                  color: "#3a1f00",
                }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label"
                style={{ color: "#f5f1e9" }}
              >
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  backgroundColor: "#b89972",
                  border: "1px solid #4b2e05",
                  color: "#3a1f00",
                }}
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              disabled={isLoading}
              style={{
                backgroundColor: "#4b2e05",
                borderColor: "#3a1f00",
                color: "#f5f1e9",
                fontWeight: "600",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#3a1f00")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#4b2e05")
              }
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    style={{ color: "#f5f1e9" }}
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
