import { useState } from "react";
const TableFooter = ({ footerData, footerClasses }) => {
    return (
        <tfoot className={footerClasses && footerClasses}>
            <tr>
                {footerData.map((column, index) => (
                    <td
                        key={index}
                        // className={cellClasses && cellClasses(data, data[header.accessor])}
                    >
                        {column?.value}
                    </td>
                ))}
            </tr>
        </tfoot>
    );
};

export default TableFooter;
