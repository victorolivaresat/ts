import { reactive } from "vue";

export function useTable(fetchDataFn, initialColumns = []) {
  const tableConfig = reactive({
    isLoading: false,
    columns: initialColumns,
    rows: [],
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10,
    messages: {
      pagingInfo: "Mostrando {0}-{1} of {2} resultados",
      pageSizeChangeLabel: " Páginas por:",
      gotoPageLabel: "Ir a la página",
      noDataAvailable: "No hay datos disponibles",
    },
  });

  const fetchTableData = async (
    page = 1,
    itemsPerPage = 10,
    sortField = "id",
    sortOrder = "asc"
  ) => {
    tableConfig.isLoading = true;
    try {
      const response = await fetchDataFn({
        page,
        limit: itemsPerPage,
        sortBy: sortField,
        sortOrder,
      });

      tableConfig.rows = response.data;
      tableConfig.totalItems = response.totalItems;

      console.log("Table data fetched:", response);
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      tableConfig.isLoading = false;
    }
  };

  return { tableConfig, fetchTableData };
}
