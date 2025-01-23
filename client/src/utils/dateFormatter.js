import { format } from 'date-fns';

export function formatDate(date, formatString = 'yyyy-MM-dd') {
    return format(new Date(date), formatString);
}

export function formatDateTime(date, formatString = 'yyyy-MM-dd HH:mm:ss') {
    return format(new Date(date), formatString);
}

export function formatTime(date, formatString = 'HH:mm:ss') {
    return format(new Date(date), formatString);
}