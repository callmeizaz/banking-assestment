import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const HomePage = ({ id }) => {
  const [checkingBalance, setCheckingBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [transferAmount, setTransferAmount] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = getCookie("user");
    // redirect if no user
    if (!user) {
      router.push("/login");
      return;
    }

    const parseUser = JSON.parse(user);
    const { username, checkingBalance, savingBalance } = parseUser;
    setUserName(username);
    setCheckingBalance(checkingBalance);
    setSavingsBalance(savingBalance);
    setLoading(false);
  }, []);

  const handleTransfer = async (fromAccount, toAccount) => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0 || amount > fromAccount) {
      setMessage("Invalid transfer amount");
    } else {
      setSubmitting(true);
      const body = {
        amount: amount,
        id,
        from: fromAccount,
        to: toAccount,
      };
      const response = await fetch("/api/banking/transfer", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle success, redirect, or update UI accordingly
        setCookie("user", data);
        setCheckingBalance(data.user.checkingBalance);
        setSavingsBalance(data.user.savingBalance);
        setTransferAmount(0);
      } else {
        const errorData = await response.json();
        return setMessage(errorData.message || "An error occurred.");
        // Handle error, show error message, or update UI accordingly
      }
      setMessage("Funds transferred successfully");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">
          Welcome {userName}
        </h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Checking Account</h2>
          <p className="text-gray-700">Balance: ${checkingBalance}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Savings Account</h2>
          <p className="text-gray-700">Balance: ${savingsBalance}</p>
        </div>

        <div className="mb-4">
          <label htmlFor="transferAmount" className="block text-gray-700">
            Transfer Amount:
          </label>
          <input
            type="number"
            id="transferAmount"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
        </div>

        <button
          disabled={submitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          onClick={() => handleTransfer("checkingBalance", "savingBalance")}
        >
          Transfer to Savings
        </button>

        <button
          disabled={submitting}
          className="w-full bg-blue-500 text-white p-2 mt-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          onClick={() => handleTransfer("savingBalance", "checkingBalance")}
        >
          Transfer to Checking
        </button>

        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default HomePage;
