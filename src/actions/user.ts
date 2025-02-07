/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserData } from "@/types";
import { PaginationState } from "@tanstack/react-table";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL as string;

// registerUser
export const registerUser = async (
  email: string,
  name: string,
  phoneNumber: string
) => {
  const token = Cookies.get("access_token");
  try {
    const response = await fetch(`${apiUrl}/account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        name: name,
        phone_number: `0${phoneNumber}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    const result = await response.json();
    const data = result.data; 
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// getUsers
export const getUsers = async (
  name_like?: string,
  pagination?: PaginationState
) => {
  const token = Cookies.get("access_token");

  const qp = new URLSearchParams({
    ...(name_like && { name_like: name_like }),
    page: (pagination?.pageIndex !== undefined
      ? pagination.pageIndex + 1
      : 1
    ).toString(),
    size: pagination?.pageSize?.toString() || "10",
  });

  const response = await fetch(`${apiUrl}/users?${qp}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    window.location.reload();
  }

  return response.json();
};

//getUserById
export const getUserById = async (id: string): Promise<UserData> => {
  const token = Cookies.get("access_token");
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user with id ${id}`);
  }

  const result = await response.json();
  const data = result.data; 
  return data.User;
};

// getUserAccess
export const getUserAccess = async (id: string) => {
  const token = Cookies.get("access_token");

  try {
    const response = await fetch(`${apiUrl}/users/${id}/access`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch access for user with id ${id}`);
    }

    const result = await response.json();
    const data = result.data; 
    return data.accesses;
  } catch (error) {
    console.error("Error fetching user access:", error);
    throw error;
  }
};

// assignUserAccess
export const assignUserAccess = async (id: string, accesses: string[]) => {
  const token = Cookies.get("access_token");

  try {
    const response = await fetch(`${apiUrl}/users/${id}/access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        accesses: accesses,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to assign access for user with id ${id}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error assigning access to user:", error);
    throw error;
  }
};

// activateAccountInitiate
export const activateAccountInitiate = async (userId: string) => {
  const token = Cookies.get("access_token");

  try {
    const response = await fetch(`${apiUrl}/account/activate/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send activation email");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error initiating account activation:", error);
    throw error;
  }
};

// activateAccountVerify
export const activateAccountVerify = async (
  activationToken: string,
  password: string,
  pin: string
) => {
  try {
    const response = await fetch(`${apiUrl}/account/activate/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activation_token: activationToken,
        password: password,
        pin: pin,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to activate account");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error verifying account activation:", error);
    throw error;
  }
};


// Initiate password reset
export const initiatePasswordReset = async (userId: string) => {
  const token = Cookies.get("access_token");
  try {
    const response = await fetch(`${apiUrl}/password/reset/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate password reset');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error initiating password reset:', error);
    throw error;
  }
};


// Verify password reset
export const verifyPasswordReset = async (
  newPassword: string,
  passwordResetToken: string
) => {
  try {
    const response = await fetch(`${apiUrl}/password/reset/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        new_password: newPassword,
        password_reset_token: passwordResetToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify password reset');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying password reset:', error);
    throw error;
  }
};

// Initiate password change
export const initiateChangePassword = async () => {
  const token = Cookies.get("access_token");

  try {
    const response = await fetch(`${apiUrl}/password/change/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error('Failed to initiate password change');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error initiating password change:', error);
    throw error;
  }
};


// Verify password change
export const verifyChangePassword = async (
  oldPassword: string,
  newPassword: string,
  otp: string
) => {
  const token = Cookies.get("access_token");

  try {
    const response = await fetch(`${apiUrl}/password/change/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        otp: otp,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify password change');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying password change:', error);
    throw error;
  }
};


// Initiate PIN change
export const initiateChangePIN = async () => {
  const token = Cookies.get("access_token");

  try {
    const response = await fetch(`${apiUrl}/pin/change/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to initiate PIN change');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error initiating PIN change:', error);
    throw error;
  }
};

// Verify PIN change
export const verifyChangePIN = async (newPin: string, otp: string) => {
  const token = Cookies.get("access_token");

  try {
    const response = await fetch(`${apiUrl}/pin/change/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        new_pin: newPin,
        otp: otp,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify PIN change');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying PIN change:', error);
    throw error;
  }
};
