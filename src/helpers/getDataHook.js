import { useEffect, useState, useCallback } from "react";
import { callGetApi } from "../_service";

const useGetMountData = (baseUrl) => {
  const [data, setData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState("");
  const [customData, setCustomData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLength, setDataLength] = useState(0);
  const [filter, setFilter] = useState("");

  const pageLimit = 10;

  const getAllData = useCallback(
    async (loadText) => {
      setLoading(loadText || true);
      try {
        const url = `${baseUrl}`;
        const response = await callGetApi(url);
        if (response?.status) {
          setData(response.data);
          setBackupData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl] // Dependencies
  );

  useEffect(() => {
    if (baseUrl) {
      getAllData(true);
    }
  }, [getAllData, baseUrl]);

  const openModelWithItem = (key, item) => {
    setIsOpen(key);
    setCustomData(item);
  };

  return {
    data,
    setData,
    backupData,
    loading,
    setLoading,
    currentPage,
    setCurrentPage,
    isOpen,
    setIsOpen,
    filter,
    setFilter,
    pageLimit,
    dataLength,
    getAllData,
    customData,
    openModelWithItem,
  };
};

export default useGetMountData;
