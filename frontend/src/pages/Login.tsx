import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(true);

  const { login, user } = useAuth(); // ✅ added user
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const shoeEmojis = ["👟", "🥿", "👠", "🥾", "👢"];

  useEffect(() => {
    setCaptchaLoading(true);
    const timer = setTimeout(() => {
      setIsHuman(true);
      setCaptchaLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes brownFade {
            0% { background: linear-gradient(135deg, #c7a17a, #8b5e3c); }
            25% { background: linear-gradient(135deg, #8b5e3c, #4b2e05); }
            50% { background: linear-gradient(135deg, #4b2e05, #3a1f00); }
            75% { background: linear-gradient(135deg, #a97458, #6b4a1c); }
            100% { background: linear-gradient(135deg, #c7a17a, #8b5e3c); }
          }

          .background-fade {
            animation: brownFade 20s ease infinite;
            background-size: 400% 400%;
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
          }

          .falling-shoe {
            position: absolute;
            top: -50px;
            animation: fallStraight 6s linear infinite;
            opacity: 0.8;
            z-index: 1;
          }

          @keyframes fallStraight {
            0% {
              top: -50px;
              opacity: 0;
              transform: rotate(0deg);
            }
            10% {
              opacity: 1;
            }
            100% {
              top: 110vh;
              opacity: 0;
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <div className="background-fade">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="falling-shoe"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${1 + Math.random() * 2}rem`,
            }}
          >
            {shoeEmojis[Math.floor(Math.random() * shoeEmojis.length)]}
          </span>
        ))}

        <div
          className="card p-4 shadow"
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#8b5e3c",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(75, 46, 5, 0.6)",
            color: "#fff",
            zIndex: 2,
          }}
        >
          <h2 className="text-center mb-4" style={{ fontWeight: "700" }}>
            REKBRANEZ
          </h2>

          {user ? (
            <div className="text-center">
              <p>You are already logged in.</p>
              <button
                className="btn"
                style={{
                  backgroundColor: "#4b2e05",
                  borderColor: "#3a1f00",
                  color: "#f5f1e9",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3a1f00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4b2e05")
                }
                onClick={() => navigate("/")}
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
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
              }}
            >
              {error && (
                <div
                  className="alert"
                  role="alert"
                  style={{
                    backgroundColor: "#a97458",
                    color: "#3a1f00",
                    border: "none",
                    fontWeight: "600",
                  }}
                >
                  {error}
                </div>
              )}
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{ color: "#f5f1e9" }}
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
                    backgroundColor: "#b89972",
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

              <div
                className="d-flex align-items-center justify-content-between mb-3 p-3 rounded"
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #d3d3d3",
                  borderRadius: "8px",
                  height: "88px",
                  position: "relative",
                }}
              >
                <div
                  className="d-flex align-items-center"
                  style={{ marginLeft: "8px" }}
                >
                  <div
                    className="position-relative"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="fakeCaptcha"
                      checked={isHuman}
                      readOnly
                      disabled
                      style={{
                        width: "100%",
                        height: "100%",
                        opacity: isHuman ? 1 : 0.5,
                        cursor: "not-allowed",
                      }}
                    />
                    {captchaLoading && (
                      <div
                        className="position-absolute top-0 start-0 d-flex justify-content-center align-items-center"
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(255,255,255,0.7)",
                          borderRadius: "4px",
                        }}
                      >
                        <div
                          className="spinner-border text-secondary"
                          role="status"
                          style={{ width: "1rem", height: "1rem" }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <label
                    className="ms-3"
                    htmlFor="fakeCaptcha"
                    style={{ fontSize: "16px", fontWeight: 500, color: "#000" }}
                  >
                    I'm not a robot
                  </label>
                </div>

                <div className="text-end pe-2">
                  <img
                    src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                    alt="reCAPTCHA"
                    style={{
                      width: "32px",
                      height: "32px",
                      marginBottom: "4px",
                    }}
                  />
                  <div style={{ fontSize: "10px", color: "#6b6b6b" }}>
                    reCAPTCHA
                  </div>
                  <div style={{ fontSize: "10px", color: "#6b6b6b" }}>
                    Privacy - Terms
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100"
                disabled={isLoading || !isHuman}
                style={{
                  backgroundColor: "#4b2e05",
                  borderColor: "#3a1f00",
                  color: "#f5f1e9",
                  fontWeight: "600",
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
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
