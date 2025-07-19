import React, { useState, useEffect } from "react";
import "../Checkout.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { saveAddress, getAddresses } from "../api/apiconsume";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CardContext";
import handlePayment from "../components/PaymentButton";
import { useNavigate } from "react-router-dom";
// Configure Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Reverse geocode lat/lng to address
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch address");
    const data = await response.json();
    return data.display_name || "";
  } catch {
    return "";
  }
}

// Geocode pincode to lat/lng
async function geocodePostalCode(pincode) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&postalcode=${pincode}&limit=1`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to geocode pincode");
    const data = await response.json();
    if (data.length === 0) return null;
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      display_name: data[0].display_name,
    };
  } catch {
    return null;
  }
}

// Map marker component
const LocationMarker = ({ position, setPosition, setAddress }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      const addr = await reverseGeocode(lat, lng);
      setAddress(addr);
    },
  });
  return position ? <Marker position={position} /> : null;
};

const CheckoutForm = ({}) => {
  const { user } = useAuth();
  const user_id = user?.uid;

  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [mapEnabled, setMapEnabled] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [error, setError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const { orderDetails } = useCart();
  const [pointerEvent, setPointerEvents] = useState("auto");
  const [selectedAddress, setSelectedAddress] = useState("");
  const navigate = useNavigate();

  // Fetch saved addresses
  useEffect(() => {
    const fetchSaved = async () => {
      if (!user_id) return setAddrLoading(false);
      if (!orderDetails.cart || orderDetails?.cart?.length === 0 )  return navigate("/cart");
      try {
        setMobileNumber(user?.mobileNumber || "");
        const data = await getAddresses(user_id);
        const firstPincode = data?.addresses?.[0]?.address?.split(", ")[0] || "";
        setSavedAddresses(
          data?.addresses?.map((address) => {
            return {
              address: address.address || "",
              pincode: (firstPincode.length === 6 && Number(firstPincode)) || address.address.split(", ").filter((a) => Number(a) && a.length === 6) || "",
            };
          }) || []
        );
      } catch (err) {
        console.error("Failed to load addresses", err);
      } finally {
        setAddrLoading(false);
      }
    };
    fetchSaved();
  }, [user]);

  // Handle pincode search
  const handlePincodeSearch = async () => {
    if (!pincode) return setPincodeError("⚠️ Please enter a pincode");
    setPincodeError("");
    setMapLoading(true);
    const result = await geocodePostalCode(pincode);
    setMapLoading(false);

    if (!result) return setPincodeError("❌ Pincode not found");

    setMapCenter([result.lat, result.lon]);
    setPosition({ lat: result.lat, lng: result.lon });
    setAddress(result.display_name);
    setMapEnabled(true);
  };

  // Handle saved address selection
  const handleSavedSelect = async (e) => {
    const idx = e.target.value;
    if (idx === "") return;
    const selected = savedAddresses[idx];
    setMobileNumber(selected.mobileNumber || mobileNumber);
    setPincode(selected.pincode || "");
    setSelectedAddress(selected.address || "");
    setAddress(selected.address);
    setMapEnabled(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobileNumber || !address || !pincode) {
      setError("❗ Please fill in all fields and select a location.");
      return;
    }
    if (mobileNumber.length !== 10) {
      setError("📱 Mobile number should be 10 digits.");
      return;
    }

    setError("");

    try {
      if (selectedAddress !== address) {
        await saveAddress({
          user_id,
          address,
          pincode,
          mobileNumber,
          location: position,
        });
      }
      setPointerEvents("none");
      await handlePayment({
        ...orderDetails,
        mobile_number: mobileNumber,
        address,
      });
    } catch (err) {
      setPointerEvents("auto");
      setError("Failed to save address. Please try again.");
    } finally {
      navigate("/cart");
    }
  };

  return (
    <div className="container" style={{ pointerEvents: pointerEvent }}>
      <h2 className="heading">🛒 Checkout</h2>
      {error && <div className="error">{error}</div>}

      {addrLoading ? (
        <div className="loader-section">
          <div className="spinner"></div>
          <p>💾 Loading saved addresses...</p>
        </div>
      ) : savedAddresses.length > 0 ? (
        <div className="form-group">
          <label className="label">📚 Select Saved Address:</label>
          <select className="input" onChange={handleSavedSelect}>
            <option value="">-- Choose --</option>
            {savedAddresses.map((addr, i) => (
              <option key={i} value={i}>
                📍 {addr.address.slice(0, 50)}...
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <label className="label">📱 Mobile Number:</label>
        <input
          type="tel"
          className="input"
          value={mobileNumber}
          required
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <label className="label">📍 Pincode:</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <input
            type="text"
            className="input"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <button
            type="button"
            className="button"
            style={{ flexShrink: 0 }}
            onClick={handlePincodeSearch}
          >
            🔍 Search
          </button>
        </div>
        {pincodeError && <div className="error">{pincodeError}</div>}

        {mapLoading ? (
          <div className="loader-section">
            <div className="spinner"></div>
            <p>🗺️ Loading map...</p>
          </div>
        ) : mapEnabled ? (
          <>
            <label className="label">🏠 Address:</label>
            <textarea
              className="textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              required
            />

            <label className="label">🗺️ Tap to select location:</label>
            <div
              className="mapContainer"
              style={{ height: "300px", marginBottom: "15px" }}
            >
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={false}
                key={mapCenter.toString()}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker
                  position={position}
                  setPosition={setPosition}
                  setAddress={setAddress}
                />
              </MapContainer>
            </div>
          </>
        ) : (
          <p style={{ color: "#555" }}>
            ℹ️ Enter a pincode and click search to load the map.
          </p>
        )}

        <button
          type="submit"
          disabled={!mobileNumber || !address || !pincode}
          className="button"
        >
          ✅ Save Address
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
