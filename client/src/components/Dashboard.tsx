import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
//import { Link } from "react-router-dom";


interface PasswordEntry {
  _id?: string;
  site: string;
  username: string;
  encryptedPassword: string;
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, masterKey, _id } = location.state || {};

  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [visible, setVisible] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    // if (!email || !masterKey || !_id) {
    //   console.warn("Missing state data. Redirecting to login.");
    //   //navigate("/login");
    //   return;
    // }
    fetchPasswords();
  }, [email, masterKey, _id]);

  function deriveKey(masterKey: string, salt: string): CryptoJS.lib.WordArray {
    return CryptoJS.PBKDF2(masterKey, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });
  }

  const fetchPasswords = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/passwords/`, {
        _id
      }, {
        withCredentials: true,
      });
      console.log("Fetched data:", response.data);
      const found = response.data.map((entry: PasswordEntry) => ({
        site: entry.site,
        username: entry.username,
        encryptedPassword: entry.encryptedPassword,
        _id: entry._id
      }));
      console.log(found, "found")
      setPasswords(found);
      console.log(passwords, "in state")
    } catch (err) {
      console.error("Failed to fetch passwords:", err);
      setError("Failed to load passwords.");
    }
  };

  const toggleVisibility = (index: number) => {
    setVisible((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const decryptPassword = (encrypted: string): string => {
    if (!masterKey) return "Missing master key";
    try {
      const derivedKey = deriveKey(masterKey, email);
      const bytes = CryptoJS.AES.decrypt(encrypted, derivedKey.toString());
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      // const bytes = CryptoJS.AES.decrypt(encrypted, masterKey);
      // const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || "Decryption failed";
    } catch (error) {
      console.error("Decryption error:", error);
      return "Error";
    }

  };

  const handleAddOrUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.site || !form.username || !form.password) {
      setError("All fields are required.");
      return;
    }

    try {
      const derivedKey = deriveKey(masterKey, email); // using email as salt
      const encryptedPassword = CryptoJS.AES.encrypt(form.password, derivedKey.toString()).toString();
      // const encryptedPassword = CryptoJS.AES
      //   .encrypt(form.password, masterKey)
      //   .toString(CryptoJS.format.OpenSSL);

      console.log("check", form.site)

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/passwords/update/${editingId}`, {
          site: form.site,
          username: form.username,
          encryptedPassword: encryptedPassword,
        }, {
          withCredentials: true,
        });
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/passwords/add`, {
          email,
          site: form.site,
          username: form.username,
          encryptedPassword: encryptedPassword,
        }, {
          withCredentials: true,
        });
      }

      setForm({ site: "", username: "", password: "" });
      fetchPasswords();
    } catch (err) {
      console.error("Failed to add password:", err);
      setError("Error adding password.");
    }
  };

  const handleEdit = (entry: PasswordEntry) => {
    console.log(entry, "en")
    setForm({
      site: entry.site,
      username: entry.username,
      password: decryptPassword(entry.encryptedPassword),
    });
    setEditingId(entry._id || null);
    console.log(editingId, "ee")
  };

  const handleDelete = async (entryId: string | undefined) => {
    if (!entryId) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/passwords/delete/${entryId}`, {
        withCredentials: true,
      });
      fetchPasswords();
    } catch (err) {
      console.error("Failed to delete password:", err);
      setError("Error deleting password.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, null, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
      >
        Logout
      </button>
      <h1 className="text-3xl font-bold mb-6">Dashboard - {email}</h1>

      <form onSubmit={handleAddOrUpdatePassword} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4">
        <h2 className="text-xl font-semibold">{editingId ? "Edit Password" : "Add New Password"}</h2>

        <input
          type="text"
          name="site"
          value={form.site}
          onChange={handleChange}
          placeholder="Site or App Name"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username or Email"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {editingId ? "Update Password" : "Save Password"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Stored Passwords</h2>

        {passwords.length === 0 ? (
          <p className="text-gray-600">No passwords saved yet.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Site</th>
                <th className="text-left py-2">Username</th>
                <th className="text-left py-2">Password</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{entry.site}</td>
                  <td className="py-2">{entry.username}</td>
                  <td className="py-2"><span className="font-mono">
                    {visible[index]
                      ? decryptPassword(entry.encryptedPassword)
                      : "••••••••"}
                  </span>
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => toggleVisibility(index)}
                    >
                      {visible[index] ? "Hide" : "Show"}
                    </button>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-yellow-600 hover:underline mr-4 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
