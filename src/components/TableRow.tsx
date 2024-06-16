import { Table } from "@mantine/core";
import Link from "next/link";
import { MdOutlineStarOutline } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";

export interface TableRowProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  marketCapUsd: string;
  isFavourite: boolean;
  setIsFavourite: () => void;
}

const TableRow = ({
  id,
  name,
  symbol,
  priceUsd,
  marketCapUsd,
  isFavourite,
  setIsFavourite,
}: TableRowProps) => {
  return (
    <Table.Tr key={id}>
      <Table.Td>
        <div className="flex items-center">
          {symbol}{" "}
          <div className="px-4 cursor-pointer" onClick={setIsFavourite}>
            {isFavourite ? <MdOutlineStar /> : <MdOutlineStarOutline />}
          </div>
        </div>
      </Table.Td>
      <Table.Td className="cursor-pointer">
        <Link href={`/detail/${id}`}>{name}</Link>
        {/* {name} */}
      </Table.Td>
      <Table.Td>$ {priceUsd}</Table.Td>
      <Table.Td>{marketCapUsd}</Table.Td>
    </Table.Tr>
  );
};

export default TableRow;
