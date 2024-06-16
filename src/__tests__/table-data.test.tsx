import React from "react";
import "@testing-library/jest-dom";
import { render, waitFor } from "../test-utils";
import Page from "../app/page";

// Mock the fetch function
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    data: [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        priceUsd: "40000",
        marketCapUsd: "800000000000",
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        priceUsd: "3000",
        marketCapUsd: "350000000000",
      },
      // Add more mock data as needed
    ],
  }),
} as Response);

describe("TableData Component", () => {
  it("renders table with fetched data", async () => {
    const { getByText, queryByTestId } = render(<Page />);

    // Expect loader to be displayed while fetching data
    expect(queryByTestId("loader")).toBeInTheDocument();

    // Wait for data to be fetched and loader to disappear
    await waitFor(() => {
      expect(getByText("Symbol ↑")).toBeInTheDocument(); // Check for table header
      expect(getByText("BTC")).toBeInTheDocument(); // Check for specific data row
      expect(getByText("Bitcoin")).toBeInTheDocument(); // Check for specific data row
      expect(getByText("350000000000")).toBeInTheDocument();
    });
  });

  // Add more test cases to handle error scenarios if needed
});
