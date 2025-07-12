import "../Popup.css";

function Popup({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✖</button>
        <h2>You're not logged in</h2>
        <p>Please login with Google to continue.</p>
      </div>
    </div>
  );
}

export default Popup;
