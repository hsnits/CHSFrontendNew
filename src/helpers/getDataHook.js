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
  const [query, setQuery] = useState({});
  const [pageLimit, setPageLimit] = useState(10);

  const getAllData = useCallback(
    async (baseUrl, loadText) => {
      setLoading(loadText || true);
      try {
        debugger;
        let url = `${baseUrl}?limit=${pageLimit}&currentPage=${currentPage}`;

        if (query && Object.keys(query).length > 0) {
          const params = new URLSearchParams();

          params.append("limit", pageLimit);
          params.append("currentPage", currentPage);

          if (query.category) params.append("category", query.category);
          if (query.status) params.append("status", query.status);
          if (query.time) params.append("time", query.time);
          if (query.startDate) params.append("startDate", query.startDate);
          if (query.endDate) params.append("endDate", query.endDate);

          url = `${baseUrl}?${params.toString()}`;
        }
        const response = await callGetApi(url);
        if (response?.status || response?.success) {
          setData(response.data);
          setBackupData(response.data);
          // Update dataLength with total count from API response
          if (response?.pagination) {
            setDataLength(response.pagination.total);
            setPageLimit(response.pagination.limit);
          } else if (response.totalCount !== undefined) {
            setDataLength(response.totalCount);
          } else if (response.count !== undefined) {
            setDataLength(response.count);
          } else if (response.data && Array.isArray(response.data)) {
            setDataLength(response.data.length);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setDataLength(0);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, query, currentPage, pageLimit]
  );

  useEffect(() => {
    if (baseUrl) {
      getAllData(baseUrl, true);
    }
  }, [getAllData, baseUrl, query, currentPage, pageLimit]);

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
    setPageLimit,
    pageLimit,
  };
};

export default useGetMountData;
