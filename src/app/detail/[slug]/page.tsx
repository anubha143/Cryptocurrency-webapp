"use client";

import { useEffect, useState } from "react";
import { paramsType } from "./types";
import { Loader } from "@mantine/core";
import { Alert } from "@mantine/core";
import { IoAlertCircleOutline } from "react-icons/io5";
import useFetchData from "../../../hooks/useFetchData";

const Details = ({ params }: paramsType) => {
  const id = params.slug;
  const { data, loading, error } = useFetchData(
    "https://api.coincap.io/v2/assets",
    id
  );

  if (error) {
    return (
      <Alert
        variant="light"
        color="red"
        title="Alert title"
        icon={<IoAlertCircleOutline />}
        className="m-4"
      >
        Error: {error}
      </Alert>
    );
  }

  const keys = ["name", "symbol", "priceUsd", "marketCapUsd"];

  return (
    <div className="p-10 mx-auto">
      {loading ? (
        <div
          data-testid="loader"
          className="flex items-center justify-center h-screen w-screen"
        >
          <Loader size={150} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {keys.map((key) => (
            <div className="flex flex-col space-y-2 items-center border shadow p-4 rounded-lg">
              <p className="capitalize">{key}</p>
              <p className="font-semibold text-2xl">{data[key]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Details;
