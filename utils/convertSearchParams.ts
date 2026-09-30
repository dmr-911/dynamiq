// export function convertSearchParams(searchParams: {
//   page?: any;
//   pageSize?: any;
//   sort_by?: any;
//   group_by?: string;
// }) {
//   const urlSearchParams = new URLSearchParams();

//   // Parse and append pagination parameters
//   if (searchParams.page) {
//     urlSearchParams.append('page', searchParams.page.toString());
//   }
//   if (searchParams.pageSize) {
//     urlSearchParams.append('pageSize', searchParams.pageSize.toString());
//   }

//   // Handle sort_by parameter
//   if (searchParams.sort_by) {
//     try {
//       let sortObject;

//       if (typeof searchParams.sort_by === 'string') {
//         // Handle string input format '{name:desc}'
//         const cleanedSortBy = searchParams.sort_by
//           .replace(/{|}/g, '')
//           .replace(/:/g, '":"')
//           .replace(/,/g, '","');
//         sortObject = JSON.parse(`{"${cleanedSortBy}"}`);
//       } else if (typeof searchParams.sort_by === 'object') {
//         // Handle direct object input
//         sortObject = searchParams.sort_by;
//       }

//       if (sortObject) {
//         urlSearchParams.append('sort_by', JSON.stringify(sortObject));
//       }
//     } catch (e) {
//       console.error('Error processing sort_by parameter:', e);
//     }
//   }

//   // Append group_by
//   if (searchParams.group_by) {
//     urlSearchParams.append('group_by', searchParams.group_by);
//   }

//   return `?${urlSearchParams.toString()}`;
// }

export function convertSearchParams(searchParams: Record<string, any>) {
  const urlSearchParams = new URLSearchParams();

  // Loop through all parameters
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      try {
        if (typeof value === 'object') {
          // Handle objects (including arrays)
          urlSearchParams.append(key, JSON.stringify(value));
        } else {
          // Handle primitive values
          urlSearchParams.append(key, value.toString());
        }
      } catch (e) {
        console.error(`Error processing parameter ${key}:`, e);
      }
    }
  });

  return `?${urlSearchParams.toString()}`;
}
