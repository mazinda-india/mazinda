"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SearchPage = ({ params }) => {
  const product_name = decodeURIComponent(params.name);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async (searchQuery) => {
      const response = await axios.post("/api/product/fetch-search-products", {
        searchQuery,
      });
      setProducts(response.data.products);
      console.log(response.data.products);
    };

    fetchProducts(product_name);
  }, []);

  return (
    <>
      <div className="text-center font-bold px-10">
        Search Results for "{product_name}"
      </div>
      <div className="flex flex-wrap mt-4 justify-center">
        {products.map((product) => {
          return (
            <div
              key={product._id}
              className="w-40 p-2 bg-gray-50 m-2 rounded-md"
            >
              <div className="h-44 flex items-center justify-center cursor-pointer" onClick={() => { router.push(`/product/view-product?id=${product._id}`) }}>
                <img
                  className="rounded-lg w-full"
                  src={product.imageURI}
                  alt="product"
                />
              </div>

              <div>
                <div className="mt-2">
                  <span className="font-semibold cursor-pointer" onClick={() => { router.push(`/product/view-product?id=${product._id}`) }}>
                    {product.productName.slice(0, 28)}...
                  </span>
                </div>

                <div className="flex flex-col mt-2">
                  <span className="">₹{product.pricing.costPrice}</span>
                  <span className="text-[10px] line-through text-gray-500">
                    ₹{product.pricing.mrp}
                  </span>
                </div>

                <div className="flex mt-2 w-full">
                  <div className="font-semibold mx-1 text-[0.6em] border border-[#F17E13] px-2 py-1 rounded-full shadow flex items-center justify-center">
                    Add to Cart
                  </div>
                  <div className="font-semibold text-[0.6em] bg-[#F17E13] text-white px-2 py-1 rounded-full shadow flex items-center justify-center">
                    Buy Now
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SearchPage;
