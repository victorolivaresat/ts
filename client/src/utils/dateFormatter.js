import { format } from "date-fns";

const formatDate = (date, formatString = "yyyy-MM-dd") =>
  format(new Date(date), formatString);

const formatDateTime = (date, formatString = "dd/MM/yyyy HH:mm:ss") =>
  format(new Date(date), formatString);

const formatTime = (date, formatString = "HH:mm:ss") =>
  format(new Date(date), formatString);

export { formatDate, formatDateTime, formatTime };
