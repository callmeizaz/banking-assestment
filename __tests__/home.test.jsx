import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "../path/to/HomePage"; // Update the path accordingly

describe("HomePage", () => {
  it("renders user name and checking account balance", async () => {
    const { getByText } = render(<HomePage id="1" />); // Provide a sample id
    await waitFor(() => expect(getByText("Welcome")).toBeInTheDocument());
    expect(getByText("Balance: $1000")).toBeInTheDocument();
  });

  it("renders user name and savings account balance", async () => {
    const { getByText } = render(<HomePage id="1" />);
    await waitFor(() => expect(getByText("Welcome")).toBeInTheDocument());
    expect(getByText("Balance: $2000")).toBeInTheDocument();
  });

  it("handles invalid transfer amount", async () => {
    const { getByLabelText, getByText } = render(<HomePage id="1" />);
    await waitFor(() => expect(getByText("Welcome")).toBeInTheDocument());
    fireEvent.change(getByLabelText("Transfer Amount:"), {
      target: { value: "-100" },
    });
    fireEvent.click(getByText("Transfer to Savings"));
    await waitFor(() =>
      expect(getByText("Invalid transfer amount")).toBeInTheDocument()
    );
  });

  it("handles successful transfer to savings", async () => {
    const { getByLabelText, getByText } = render(<HomePage id="1" />);
    await waitFor(() => expect(getByText("Welcome")).toBeInTheDocument());
    fireEvent.change(getByLabelText("Transfer Amount:"), {
      target: { value: "500" },
    });
    fireEvent.click(getByText("Transfer to Savings"));
    await waitFor(() =>
      expect(getByText("Funds transferred successfully")).toBeInTheDocument()
    );
    expect(getByText("Balance: $500")).toBeInTheDocument();
    expect(getByText("Balance: $2500")).toBeInTheDocument();
  });

  it("handles successful transfer to checking", async () => {
    const { getByLabelText, getByText } = render(<HomePage id="1" />);
    await waitFor(() => expect(getByText("Welcome")).toBeInTheDocument());
    fireEvent.change(getByLabelText("Transfer Amount:"), {
      target: { value: "500" },
    });
    fireEvent.click(getByText("Transfer to Checking"));
    await waitFor(() =>
      expect(getByText("Funds transferred successfully")).toBeInTheDocument()
    );
    expect(getByText("Balance: $500")).toBeInTheDocument();
    expect(getByText("Balance: $1500")).toBeInTheDocument();
  });
});
