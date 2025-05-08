import React, { useEffect, useState } from 'react';
import SevaCard from '../SevaCard/SevaCard';
import Pagination from '../Pagination/Pagination';

const Home = () => {
  const [sevas, setSevas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSevas, setTotalSevas] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchSevas = async () => {
      const response = await fetch(`/api/sevas?page=${currentPage}&limit=${pageSize}`);
      const data = await response.json();
      setSevas(data.sevas);
      setTotalSevas(data.totalSevas);
    };

    fetchSevas();
  }, [currentPage]);

  return (
    <div>
      <h1>Available Sevas</h1>
      <div className="seva-cards">
        {sevas.map(seva => (
          <SevaCard key={seva._id} seva={seva} />
        ))}
      </div>
      <Pagination 
        currentPage={currentPage} 
        totalSevas={totalSevas} 
        pageSize={pageSize} 
        onPageChange={page => setCurrentPage(page)} 
      />
    </div>
  );
};

export default Home;