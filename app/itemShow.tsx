"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemData: any;
}

const ItemShow = ({ isOpen, onClose, itemData }: ModalProps) => {
  const [data, setData] = useState({});

  const getItemData = async () => {
    const res = await axios
      .get(`http://localhost:4000/tasks/${itemData?.id}`)
      .then((res) => {
        console.log(res.data);

        return res.data;
      })
      .catch((error) => {
        console.error("Error getting item data:", error);
      });

    setData(res);

    return res;
  };

  useEffect(() => {
    getItemData();
  }, [itemData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-end items-center">
          <button
            onClick={onClose}
            className=" text-black p-2 rounded-md cursor-pointer"
          >
            x
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <p>ID: {data?.id || "-"}</p>
          <p>Title: {data?.title || "-"}</p>
          <p>Description: {data?.description || "-"}</p>
          <p>Status: {data?.status || "-"}</p>
          <p>Priority: {data?.priority || "-"}</p>
          <p>Created At: {data?.createdAt || "-"}</p>
          <p>Updated At: {data?.updatedAt || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemShow;
