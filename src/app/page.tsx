import dynamic from 'next/dynamic';

const Table = dynamic(() => import('../components/Table'), { ssr: false })

export default function Home() {
  return (
    <div style={{ height: "calc(100vh - 65px" }} className="p-8 overflow-auto">
      {/* <div className="p-8"> */}
      <Table />
    </div>
  );
}
