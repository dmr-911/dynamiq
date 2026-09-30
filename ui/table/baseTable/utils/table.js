// export const handlePageChanges = (page, totalPage, pageNumber, setPage) => {
//     if (pageNumber === "prev") {
//         setPage(page <= 1 ? 1 : page - 1);
//     } else if (pageNumber === "next") {
//         setPage(page == totalPage ? totalPage : page + 1);
//     } else if (pageNumber === "...") {
//         setPage(1);
//     } else {
//         setPage(pageNumber);
//     }
// };

const handleAllDataSelectedRecord = (e, toggleProduct, setToggleProduct, records) => {
    if (e === "all") {
        if (toggleProduct.length) {
            if (toggleProduct.length === records.length) {
                setToggleProduct([]);
            } else {
                // setToggleProduct(state.tableData.data);
                setToggleProduct(records);
            }
        } else {
            setToggleProduct(records);
        }
    } else {
        const result = toggleProduct.includes(e)
            ? toggleProduct.filter((item) => item?.id !== e.id)
            : [...toggleProduct, e];
        setToggleProduct(result);
    }
};

// // single every column value toggle
// export const singleMultiToggles = (data, singleValue) => {
//     let result;
//     result = [...data].map((item) => {
//         if (item.id === singleValue.id) {
//             return { ...item, ...singleValue };
//         }
//         return item;
//     });
//     return result;
// };
// //  product delete function code here
// export const handleDeleteData = (data, id) => {
//     return [...data].filter((item) => item.id !== id.id);
// };
// data search field here

export default handleAllDataSelectedRecord;
