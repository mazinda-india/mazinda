"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductsLoading from "@/components/user/loading/ProductsLoading";
import Link from "next/link";
import { useLocation, useLocationLoading } from "@/contexts/LocationContext";

const SearchPage = ({ params }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const product_name = decodeURIComponent(params.name);
  const [products, setProducts] = useState([]);

  const selectedLocation = useLocation();
  const locationLoading = useLocationLoading();

  const fetchData = async (searchQuery) => {
    const availablePincodes = selectedLocation.pincodes;
    
    const response = await axios.post("/api/product/fetch-search-products", {
      searchQuery, availablePincodes
    });
    setProducts(response.data.products);
    setPageLoading(false);
  };
  
  useEffect(() => {
    setPageLoading(true);
    if (Object.keys(selectedLocation).length){
      fetchData(product_name);
    }
  }, [locationLoading, selectedLocation]);

  return (
    <>
      {!pageLoading ? (
        <>
          <div className="text-center font-bold px-10">
            Search Results for "{product_name}"
          </div>
          <div className="flex flex-wrap mt-4 justify-evenly">
            {products.map((product) => {
              return (
                <div
                  key={product._id}
                  className="w-44 md:w-52 md:p-2 border shadow my-2 rounded-md"
                >
                  <Link href={`/product/view-product?id=${product._id}`} className="px-2 py-1 flex items-center justify-center cursor-pointer">
                    <img
                      className="rounded-lg w-full"
                      src={product.imagePaths[0]}
                      alt="product"
                    />
                  </Link>

                  <div>
                    <Link href={`/product/view-product?id=${product._id}`} className="px-2 py-1 flex mt-2 justify-between">
                      <span className="cursor-pointer text-sm mx-1">
                        {product.productName.slice(0, 25)}...
                      </span>

                      <div className="flex flex-col ml-2">
                        <span className="font-bold self-end text-[15px]">
                          ₹{product.pricing.salesPrice}
                        </span>
                        <span className="text-[10px] line-through text-gray-500 self-end">
                          ₹{product.pricing.mrp}
                        </span>
                      </div>
                    </Link>

                    {/* <div className="flex mt-2 md:mt-5 w-full justify-between p-1 mb-2">
                      <div className="w-full cursor-pointer font-semibold text-[9px] md:text-[0.7em] border border-[#F17E13] p-1 rounded-full shadow flex items-center justify-center">
                        Add to Cart
                      </div>
                      <div className="w-full cursor-pointer font-semibold text-[9px] md:text-[0.7em] bg-[#F17E13] text-white p-1 rounded-full shadow flex items-center justify-center">
                        Buy Now
                      </div>
                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="text-center font-bold px-10">
            Search Results for "{product_name}"
          </div>
          <ProductsLoading />
        </>
      )}
    </>
  );
};

export default SearchPage;
