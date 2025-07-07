import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function Allproduct({
  onProductSelect,
  onProductDelete,
  refreshKey,
}) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/products/with-names");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  return (
    <TableContainer component={Paper} className="mt-6 !rounded-2xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="!font-bold !text-[14px] !uppercase !text-center">
              Product ID
            </TableCell>
            <TableCell className="!font-bold !text-[14px] !uppercase !text-center">
              Product Name
            </TableCell>
            <TableCell className="!font-bold !text-[14px] !uppercase !text-center">
              Brand Name
            </TableCell>
            <TableCell className="!font-bold !text-[14px] !uppercase !text-center">
              Category Name
            </TableCell>
            <TableCell className="!font-bold !text-[14px] !uppercase !text-center">
              Status
            </TableCell>
            <TableCell className="!font-bold !text-[14px] !uppercase !text-center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length > 0 ? (
            products.map((row) => (
              <TableRow key={row.product_id}>
                <TableCell className="!text-center">{row.product_id}</TableCell>
                <TableCell className="!text-center">{row.product_name}</TableCell>
                <TableCell className="!text-center">{row.brand_name}</TableCell>
                <TableCell className="!text-center">{row.category_name}</TableCell>
                <TableCell className="!text-center">{row.product_status}</TableCell>
                <TableCell>
                  <div className="flex gap-6 justify-center">
                    <Button
                      className="!bg-custom-gradient !px-4 !text-white hover:!bg-[#6610f2]"
                      onClick={() =>
                        onProductSelect({
                          id: row.product_id,
                          name: row.product_name,
                        })
                      }
                      startIcon={<Edit />}
                    >
                      Edit
                    </Button>
                    <Button
                      className="!bg-[#ff4c51] !text-white hover:!bg-[#ff0000] "
                      onClick={() =>
                        onProductDelete({
                          id: row.product_id,
                          name: row.product_name,
                        })
                      }
                      startIcon={<Delete />}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7}>No Data Found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}