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
  const [query, setQuery] = useState("");

  const pageLimit = 10;

  const getAllData = useCallback(
    async (baseUrl, loadText) => {
      setLoading(loadText || true);
      try {
        let url = `${baseUrl}?limit=${pageLimit}&currentPage=${currentPage}`;
        if (query) {
          url = `${baseUrl}?limit=${pageLimit}&currentPage=${currentPage}&category=${query?.category}&status=${query?.status}&time=${query?.time}`;
        }
        if (query?.startDate && query?.endDate) {
          url = `${baseUrl}?limit=${pageLimit}&currentPage=${currentPage}&category=${query?.category}&status=${query?.status}&time=${query?.time}&startDate=${query?.startDate}&endDate=${query?.endDate}`;
        }
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
    [baseUrl, query]
  );

  useEffect(() => {
    if (baseUrl) {
      getAllData(baseUrl, true);
    }
  }, [getAllData, baseUrl, query]);

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
    query,
    setQuery,
  };
};

export default useGetMountData;
