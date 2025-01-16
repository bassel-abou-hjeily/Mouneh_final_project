
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import { useDispatch, useSelector } from "react-redux";
import { GetProducts } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { Divider, message } from "antd";
import Filters from "./Filters";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const { user } = useSelector((state) => state.users);

  const [filters, setFilters] = React.useState({
    status: "approved",
    category: [],
    ages: [],
    search: "", // Added search filter
  });

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      } else {
        message.error(response.message); // Show error message
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message); // Show error message
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: value, // Update search filter
    }));
  };

  React.useEffect(() => {
    getData();
  }, [filters]); // Trigger getData whenever filters change

  return (
    <div className="p-5 flex gap-5">
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <div className="flex flex-col gap-5 w-full">
        <div className="flex gap-5 items-center">
          {!showFilters && (
            <i
              className="ri-equalizer-line text-xl cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            ></i>
          )}
          <input
            type="text"
            placeholder="ابحث عن المنتجات هنا ..."
            className="border border-gray-300 rounded w-full p-2 h-14"
            value={filters.search} // Bind input value to search term
            onChange={handleSearch} // Update search filter on input change
          />
        </div>
        <div
          className={`grid gap-5 ${showFilters ? "grid-cols-4" : "grid-cols-5"}`}
        >
          {products?.map((product) => (
            <div
              className="border border-gray-200 rounded flex flex-col gap-5 pb-2 cursor-pointer"
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={product.images[0]}
                className="w-full h-40 object-cover"
                alt={product.name}
              />
              <div className="px-2 flex flex-col gap-1">
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <h1 className="text-sm text-gray-500">{product.description}</h1>
                <Divider />
                <span className="text-xl font-semibold text-green-700">
                  $ {product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
