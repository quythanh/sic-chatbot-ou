const convertJsDateToSqlDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Định dạng thời gian cho MySQL
    // Expected output: "2024-03-02 22:12:39"
    const formattedDate: string = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
};

export const getDate: () => string = () => {
    const date = new Date();
    return convertJsDateToSqlDate(date);
};

export const parseDate = (sqlDateString: string) => {
    const date = new Date(sqlDateString);
    return convertJsDateToSqlDate(date);
};

export default getDate;
