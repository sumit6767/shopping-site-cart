import { useEffect, useState } from "react";
import { manualLogin, registerUser, getUserProfile } from "../api/apiconsume";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const spinnerStyle = {
  border: "3px solid rgba(0,0,0,0.1)",
  borderTop: "3px solid #3498db",
  borderRadius: "50%",
  width: "18px",
  height: "18px",
  animation: "spin 1s linear infinite",
  display: "inline-block",
  marginLeft: "10px",
  verticalAlign: "middle",
};
const pagespinnerStyle = {
  border: "3px solid rgba(0,0,0,0.1)",
  borderTop: "3px solid #3498db",
  borderRadius: "50%",
  width: "250px",
  height: "250px",
  animation: "spin 1s linear infinite",
  position: "absolute",
  left: "calc(50% - 125px)",
  top: "calc(50% - 125px)",
  zindex: "1000",
};

const styles = {
  container: {
    maxWidth: "50%",
    margin: "2rem auto",
    padding: "2rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff",
  },
  heading: {
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.8rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1.8px solid #ddd",
    outline: "none",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#3498db",
  },
  button: {
    width: "100%",
    padding: "0.7rem",
    fontSize: "1.1rem",
    borderRadius: "5px",
    border: "none",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background-color 0.3s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#3498db",
  },
  registerButton: {
    backgroundColor: "#2ecc71",
    marginTop: "0.5rem",
  },
  buttonDisabled: {
    backgroundColor: "#9bbbd4",
    cursor: "not-allowed",
  },
  errorMsg: {
    color: "#e74c3c",
    fontWeight: "600",
    marginTop: "0.7rem",
    textAlign: "center",
  },
  successMsg: {
    color: "#27ae60",
    fontWeight: "600",
    marginTop: "0.7rem",
    textAlign: "center",
  },
  toggleLink: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#3498db",
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
  },
};

// Spinner keyframes CSS
const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = spinnerKeyframes;
  document.head.appendChild(styleSheet);
}

export default function AuthForm() {
  const navigate = useNavigate();
  const { user, setUser, login, isManualLogin, setIsManualLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [pageLoader, setpageLoader] = useState(false);
  const [pointerEvents, setPointerEvents] = useState("auto");

  const color = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (user) return navigate("/");
  }, [user]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const googleAuth = async () => {
    await login();
    setDisabled(true);
    setPointerEvents("none");
    setpageLoader(true);
    navigate("/cart");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!formData.email || !formData.password) {
      setError("📧 Email and 🔒 password are required.");
      return;
    }

    if (
      !isLogin &&
      (!formData.first_name || !formData.last_name || !formData.mobile)
    ) {
      setError("🧾 Please fill in all registration fields.");
      return;
    }

    if (
      formData.mobile &&
      (formData.mobile.length < 10 || formData.mobile.length > 10)
    ) {
      setError("📱 mobile number number should be at 10 digits.");
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$/;

    if (!passwordRegex.test(formData.password)) {
      setError(
        "🔒 Password must contain at least one uppercase, one lowercase letter, and one special character like @, #, etc."
      );
      return;
    }

    if (formData.password.length < 8) {
      setError("🔒 Password must contain at least 8 Characters.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await manualLogin(formData.email, formData.password);
        if (res.error) {
          setDisabled(false);
          setPointerEvents("auto");
          setpageLoader(false);
          setError("🚫 Login failed: " + res.error);
        } else {
          if (res.status === 201) {
            setDisabled(true);
            setPointerEvents("none");
            setpageLoader(true);
            const getuser = await getUserProfile(res.data?.uid);
            console.log("getuser : ", getuser);
            if (getuser.status === 200) {
              const userInfo = {
                email: formData.email,
                uid: res?.data?.uid,
                displayName: getuser.data?.name,
                mobileNumber: getuser.data?.mobile_number,
                photoURL:
                  formData.photoURL ||
                  `color:${color[Math.floor((Math.random() * 10) / 2)]}`,
              };
              console.log("userInfo : ", userInfo);
              setUser(userInfo);
              Cookies.set("user_info", JSON.stringify(userInfo), {
                expires: 1,
              });
              Cookies.set("isManualLogin", true, { expires: 1 });
              setSuccess("✅ Login successful! 🎉 Welcome back 👋");
              navigate("/cart");
            } else {
              setDisabled(false);
              setPointerEvents("auto");
              setpageLoader(false);
              setError("😕 Failed to fetch user profile. Please try again.");
            }
          } else {
            setDisabled(false);
            setPointerEvents("auto");
            setpageLoader(false);
            setError("😕 Something went wrong. Please try again.");
          }
        }
      } else {
        const res = await registerUser({...formData, mobile_number: formData.mobile});
        if (res.error) {
          setError("❌ Registration failed: " + res.error);
        } else {
          if (res.status === 409) {
            setSuccess("⚠️ You're already registered! Please log in instead.");
            setIsLogin(true);
          } else if (res.status === 201) {
            const userInfo = {
              email: formData.email,
              uid: res?.data?.uid,
              displayName: `${formData.first_name} ${formData.last_name}`,
              mobileNumber: formData.mobile,
              photoURL:
                formData.photoURL ||
                `color:${color[Math.floor((Math.random() * 10) / 2)]}`,
            };
            setUser(userInfo);
            Cookies.set("user_info", JSON.stringify(userInfo), { expires: 1 });
            Cookies.set("isManualLogin", true, { expires: 1 });
            setDisabled(true);
            setPointerEvents("none");
            setpageLoader(true);
            setSuccess("🎉 Registration successful! You can now log in ✅");
            navigate("/cart");
          } else {
            setError("😕 Something went wrong. Please try again.");
          }
        }
      }
    } catch (err) {
      setDisabled(false);
      setPointerEvents("auto");
      setpageLoader(false);
      setError("😓 Unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={pageLoader ? pagespinnerStyle : { display: "none" }}>
        <p></p>
      </div>
      <div style={{ ...styles.container, pointerEvents: `${pointerEvents}` }}>
        <h2 style={styles.heading}>{isLogin ? "🔐 Login" : "📝 Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="first_name">
                  First Name
                </label>
                <input
                  style={styles.input}
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Your first name"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="last_name">
                  Last Name
                </label>
                <input
                  style={styles.input}
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Your last name"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="mobile">
                  Mobile Number
                </label>
                <input
                  style={styles.input}
                  type="number"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Your mobile number"
                />
              </div>
            </>
          )}
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              style={styles.input}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="you@example.com"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              style={styles.input}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isLogin ? styles.loginButton : styles.registerButton),
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading || disabled}
          >
            {isLogin ? "🔓 Login" : "📝 Register"}
            {loading && <span style={spinnerStyle} />}
          </button>
        </form>
        {error && <div style={styles.errorMsg}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
              padding: "0.6rem 1.2rem",
              borderRadius: "5px",
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              color: "#444",
              width: "100%",
            }}
            disabled={loading}
            onClick={() => googleAuth()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-18.8-1.7-37-5-54.6H272v103.3h146.9c-6.3 34.4-25.1 63.6-53.6 83.2l86.3 67.2c50.5-46.6 81.9-115.3 81.9-199.1z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c72.6 0 133.4-23.9 177.8-64.8l-86.3-67.2c-24 16-54.7 25.3-91.5 25.3-70.4 0-130.1-47.6-151.4-111.4l-89.4 69.1c43.3 85.4 132.2 148.9 240.8 148.9z"
              />
              <path
                fill="#fbbc04"
                d="M120.6 326.2c-10.2-30.4-10.2-63.2 0-93.6l-89.5-69.1c-39 76.6-39 167.3 0 243.9l89.5-69.1z"
              />
              <path
                fill="#ea4335"
                d="M272 106.1c39.4 0 74.8 13.6 102.6 40.3l76.7-76.7C405.4 24.2 344.6 0 272 0 163.4 0 74.5 63.5 31.2 148.9l89.4 69.1c21.3-63.8 81-111.4 151.4-111.4z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div
          style={styles.toggleLink}
          onClick={() => {
            setIsLogin((prev) => !prev);
            setFormData({
              email: "",
              password: "",
              first_name: "",
              last_name: "",
              mobile: "",
            });
            clearMessages();
          }}
        >
          {isLogin
            ? "🆕 Don't have an account? Register here"
            : "👤 Already have an account? Login here"}
        </div>
      </div>
    </>
  );
}
