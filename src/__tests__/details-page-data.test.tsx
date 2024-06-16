import React from "react";
import "@testing-library/jest-dom";
import { render, waitFor } from "../test-utils";
import Page from "../app/detail/[slug]/page";

// Mock the fetch function
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    data: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      priceUsd: "40000",
      marketCapUsd: "800000000000",
    },
  }),
} as Response);

describe("TableData Component", () => {
  it("renders table with fetched data", async () => {
    const { getByText, queryByTestId } = render(
      <Page params={{ slug: "bitcoin" }} />
    );

    // Expect loader to be displayed while fetching data
    expect(queryByTestId("loader")).toBeInTheDocument();

    // Wait for data to be fetched and loader to disappear
    await waitFor(() => {
      expect(getByText("BTC")).toBeInTheDocument();
      expect(getByText("Bitcoin")).toBeInTheDocument();
    });
  });

  // Add more test cases to handle error scenarios if needed
});
