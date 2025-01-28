import { format, subDays } from 'date-fns';;
import { reactive } from "vue"

export function useTable(fetchDataFn, initialColumns = []) {
  const tableConfig = reactive({
    isLoading: false,
    columns: initialColumns,
    rows: [],
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10,
    sortable: {
      order: "asc",
      column: "id",
    },
    messages: {
      pagingInfo: "Mostrando {0}-{1} of {2} resultados",
      pageSizeChangeLabel: " Páginas por:",
      gotoPageLabel: "Ir a la página",
      noDataAvailable: "No hay datos disponibles",
    },
  });

  const fetchTableData = async (params = {}) => {
    tableConfig.isLoading = true;
  
    // Fechas por defecto
    const today = new Date();
    //const sevenDaysAgo = subDays(today, 7);
    const yesterday = subDays(today, 1);
    
  // Fechas por defecto
    //const startDate = params.startDate || format(sevenDaysAgo, "yyyy-MM-dd");
    const startDate = params.startDate || format(yesterday, "yyyy-MM-dd");
    const endDate = params.endDate || format(today, "yyyy-MM-dd");

    try {
      const response = await fetchDataFn({
        page: params.page || tableConfig.currentPage,
        limit: params.limit || tableConfig.itemsPerPage,
        sort: params.sort || tableConfig.sortable.column,
        order: params.order || tableConfig.sortable.order,
        startDate,
        endDate,
        search: params.search,
      });
  
      tableConfig.rows = response.data;
      tableConfig.totalItems = response.totalItems;
  
      console.log("Datos de tabla obtenidos:", { startDate, endDate, response });
    } catch (error) {
      console.error("Error al obtener datos de tabla:", error);
    } finally {
      tableConfig.isLoading = false;
    }
  };
  

  return { tableConfig, fetchTableData };
}
