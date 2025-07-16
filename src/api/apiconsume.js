// src/api/api.js
const BASE_URL = "https://grocery.cfapps.us10-001.hana.ondemand.com/"; // Update this when deploying

// 1. Manual login
export const manualLogin = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login/manual`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
};

// 2. Register new user (manual)
export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return {status: response.status, data: await response.json()};
};

// 3. Google login with Firebase token
export const loginWithGoogle = async (firebaseUser) => {
  try {
    const token = await firebaseUser.getIdToken();

    const response = await fetch(`${BASE_URL}/api/login/google`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { status: response.status, data: await response.json() };
  } catch (error) {
    console.error("Google login error:", error.message);
    return { status: 500, error: error.message };
  }
};

// 4. Save order history
export const submitOrderHistory = async ({ uid, data }) => {
  const response = await fetch(`${BASE_URL}/order_history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, data }),
  });

  return response.json();
};

// 5. Fetch recent purchases
export const getRecentPurchases = async (userId) => {
  const response = await fetch(`${BASE_URL}/recent_purchases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    return { status: 500, data: { error: "Failed to fetch recent purchases" } };
  }

  return { status: response.status, data: await response.json() };
};

// 6. Save delivery address
export const saveAddress = async ({ user_id, address }) => {
  const response = await fetch(`${BASE_URL}/save_address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id, address }),
  });

  return response.json();
};

// 7. Get saved addresses
export const getAddresses = async (userId) => {
  const response = await fetch(`${BASE_URL}/get_addresses/${userId}`);
  return response.json();
};
