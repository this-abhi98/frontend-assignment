import "./Table.css";
import { useEffect, useState } from "react";

const URL = `https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json`;

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>S.No</th>
        <th>Percentage funded</th>
        <th>Amount Pledge</th>
      </tr>
    </thead>
  );
}

function TableRow({ index, tableData }) {
  return (
    <tr id={tableData["s.no"]}>
      <td>{tableData["s.no"]}</td>
      <td>{tableData["percentage.funded"]}</td>
      <td>{tableData["amt.pledged"]}</td>
    </tr>
  );
}

function Pagination({ handlePrev, handleNext, currentPage, totalPages }) {
  return (
    <>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={handlePrev}
          aria-controls="table"
          aria-label="Previous Page"
          className={`${currentPage === 1 ? "inActive" : "active"}`}
        >
          Previous
        </button>
        <span aria-live="polite" className="count">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`${currentPage === totalPages ? "inActive" : "active"}`}
          onClick={handleNext}
          aria-controls="table"
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </>
  );
}

function Table({ maxCount }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [Error, setError] = useState(null);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(URL);
      if (res.status !== 200) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const resJSON = await res.json();
      setData(resJSON);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    const totalPages = Math.ceil(data.length / maxCount);
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * maxCount,
    currentPage * maxCount
  );

  return isLoading ? (
    <div>Loading...</div>
  ) : Error || !data.length ? (
    <div>Error fetching data or no available data</div>
  ) : (
    <div className="container">
      <h2 id="main-table" style={{ textAlign: "center", margin: "16px 0" }}>
        Table
      </h2>
      <table>
        <TableHeader />
        <tbody aria-label="table-body">
          {paginatedData.map((tableData, index) => {
            return <TableRow key={index} tableData={tableData} />;
          })}
        </tbody>
      </table>
      <Pagination
        handlePrev={handlePrev}
        handleNext={handleNext}
        totalPages={Math.ceil(data.length / maxCount)}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Table;
