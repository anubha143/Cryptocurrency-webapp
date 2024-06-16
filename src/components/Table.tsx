"use client";

import { Table } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Pagination } from "@mantine/core";
import { Loader } from "@mantine/core";
import TableRow from "./TableRow";
import { Alert } from "@mantine/core";
import { IoAlertCircleOutline } from "react-icons/io5";

interface DataItem {
  [key: string]: string;
}

const TableData = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, onChange] = useState<number>(1);
  const [sortColumn, setSortColumn] = useState<string>(
    localStorage.getItem("sort-column") || "symbol"
  );
  const [sortDirection, setSortDirection] = useState<string>(
    localStorage.getItem("sort-direction") || "asc"
  );
  const [isFavourite, setIsFavourite] = useState<{ [key: string]: boolean }>(
    JSON.parse(localStorage.getItem("favourite-currency") || "{}")
  );

  function chunk<T>(array: T[], size: number): T[][] {
    if (!array?.length) {
      return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
  }

  const paginatedData = chunk(data, 10);

  const sortColumnRef = useRef(sortColumn);
  const sortDirectionRef = useRef(sortDirection);

  useEffect(() => {
    sortColumnRef.current = sortColumn;
    sortDirectionRef.current = sortDirection;
  }, [sortColumn, sortDirection]);

  const fetchData = async () => {
    try {
      const response: Response = await fetch(
        "https://api.coincap.io/v2/assets"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      sortColumns(
        result?.data,
        sortColumnRef.current,
        sortDirectionRef.current
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // logic to store favourite currencies to localStorage
    if (data?.length > 0) {
      const storedFavouriteCurrency = JSON.parse(
        localStorage.getItem("favourite-currency") || "{}"
      );
      const newStoredFavouriteCurrency = { ...storedFavouriteCurrency };

      // if new data gets added to the API, add those new keys to the localStorage

      data?.forEach((item: DataItem) => {
        if (!(item.id in newStoredFavouriteCurrency)) {
          newStoredFavouriteCurrency[item.id] = false;
        }
      });
      localStorage.setItem(
        "favourite-currency",
        JSON.stringify(newStoredFavouriteCurrency)
      );
      setIsFavourite(newStoredFavouriteCurrency);
    }
  }, [data]);

  useEffect(() => {
    // Store favouriteStates in localStorage whenever it changes
    localStorage.setItem("favourite-currency", JSON.stringify(isFavourite));
  }, [isFavourite]);

  const handleSort = (column: string) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
    sortColumns(data, column, direction);
    localStorage.setItem("sort-column", column);
    localStorage.setItem("sort-direction", direction);
    onChange(1);
  };

  const sortColumns = (
    newData: DataItem[],
    column: string,
    direction: string
  ) => {
    const sortedData = newData.sort((a, b) => {
      if (a[column].toLowerCase() < b[column].toLowerCase()) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[column].toLowerCase() > b[column].toLowerCase()) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
  };

  const renderSortArrow = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? "↑" : "↓";
    }
    return "↑"; // Default arrow for unsorted columns
  };

  const handleSetFavourite = (id: string) => {
    setIsFavourite((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const rows = paginatedData[page - 1]?.map(
    ({ id, name, symbol, priceUsd, marketCapUsd }) => (
      <TableRow
        key={id}
        id={id}
        name={name}
        symbol={symbol}
        priceUsd={priceUsd}
        marketCapUsd={marketCapUsd}
        isFavourite={isFavourite[id]}
        setIsFavourite={() => handleSetFavourite(id)}
      />
    )
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

  return (
    <>
      {loading ? (
        <div
          data-testid="loader"
          className="flex items-center justify-center h-screen w-screen"
        >
          <Loader size={150} />
        </div>
      ) : (
        <>
          <Table
            stickyHeader
            horizontalSpacing="xl"
            verticalSpacing="md"
            withColumnBorders={true}
            withTableBorder={true}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th
                  onClick={() => handleSort("symbol")}
                  className="cursor-pointer"
                >
                  Symbol {renderSortArrow("symbol")}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort("name")}
                  className="cursor-pointer"
                >
                  Name {renderSortArrow("name")}
                </Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Market Cap in USD</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
          <Pagination
            className="flex justify-end py-8"
            total={data?.length}
            value={page}
            onChange={onChange}
          />
        </>
      )}
    </>
  );
};

export default TableData;
