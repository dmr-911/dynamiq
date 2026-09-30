export function countTotalRecords(data: any) {
    let count = 0;
    data.forEach((item: any) => {
      if (item.id) {
        count++;
      }
      if (item.groupItems && Array.isArray(item.groupItems)) {
        count += countTotalRecords(item.groupItems);
      }
    });
    return count;
  }