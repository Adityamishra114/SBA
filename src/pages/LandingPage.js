import React, { useEffect } from "react";
import SevaCard from "../components/SevaCard/SevaCard";
import Pagination from "../components/Pagination/Pagination";
import Navbar from "../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchSevas, setPage, resetSevas } from "../store/sevaSlice";
import { addToCart, removeFromCart } from "../store/cartSlice";
import "./LandingPage.css";

const LandingPage = () => {
  const dispatch = useDispatch();
  const { sevas, totalSevas, currentPage, pageSize, status } = useSelector(
    (state) => state.seva
  );
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchSevas({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    return () => {
      dispatch(resetSevas());
    };
  }, [dispatch]);

  const handleAddToCart = (seva) => {
    dispatch(addToCart(seva));
  };

  const handleRemoveFromCart = (seva) => {
    dispatch(removeFromCart(seva));
  };

  const handleViewMore = () => {
    dispatch(setPage(currentPage + 1));
  };

  return (
    <div>
      <Navbar />
      <h1>Landing Page</h1>
      <div className="seva-list-grid">
        {status === "loading" && sevas.length === 0 ? (
          <p>Loading...</p>
        ) : (
          sevas.map((seva) => (
            <SevaCard
              key={seva._id}
              seva={seva}
              inCart={cart.some((item) => item._id === seva._id)}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
            />
          ))
        )}
      </div>
      <Pagination
        currentCount={sevas.length}
        totalCount={totalSevas}
        onViewMore={handleViewMore}
      />
    </div>
  );
};

export default LandingPage;
