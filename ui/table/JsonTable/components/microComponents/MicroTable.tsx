import React from 'react';
import JsonTable from '../..';
import { generateFilterConfigurations } from '../../utils';

const MicroTable = ({
  data,
  filterOptions,
  config
}: {
  data: any;
  filterOptions?: any;
  config?: any;
}) => {
  return (
    <div className="p-4">
      <JsonTable
        height="h-[calc(100vh-460px)] md:h-full"
        config={config}
        tableData={data || []}
        // paginationData={pagination || {}}
        // onChangeGroup={(group: any) => {
        //   if (group.length === 0) {
        //     setQueryParams({ group_by: null });
        //   } else {
        //     setQueryParams({ group_by: group[0]?.label });
        //   }
        // }}
        // onChangeSort={(sort: any) => {
        //   const { field, order } = sort || {};
        //   if (field && order) {
        //     setQueryParams({ sort_by: `{${field}:${order}}` });
        //   } else {
        //     setQueryParams({ sort_by: null });
        //   }
        // }}
        // onPaginationChange={(pageData: any) => {
        //   const { page, pageSize } = pageData || {};
        //   setQueryParams({
        //     pageSize: isNaN(parseInt(pageSize)) ? null : pageSize,
        //     page: page
        //   });
        // }}
        // // loading={!isSuccess}
        // loading={isLoading}
        // dispatchFn={dispatchFn}
        filterOptions={{
          searchWith: ['name'],
          colunm: generateFilterConfigurations(filterOptions)?.column,
          groupBy: generateFilterConfigurations(filterOptions)?.groupBy,
          sortBy: generateFilterConfigurations(filterOptions)?.sortBy
        }}
      />
    </div>
  );
};

export default MicroTable;
