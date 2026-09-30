import { ReIcon } from '../../components/ReIcon/ReIcon';
import Button from './ui/button/Button';
import Modal from './ui/modal/Modal';
import React, { useState } from 'react';
import QueryBuilder from './QueryBuilder';
import BaseHeading from './ui/base-heading/BaseHeading';
import BaseParagraph from './ui/base-paragraph/BaseParagraph';

const FilterQuery = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setOpen(!open)}
        size="sm"
        variant="solid"
        shape="rounded"
        color="muted"
      >
        Filter
        <ReIcon iconName="BsFilter" />
      </Button>
      <Modal
        open={open}
        setOpen={setOpen}
        isClose
        onBackdropClick={() => setOpen(false)}
        size="2xl"
      >
        <div className="relative max-h-[calc(100vh-80px)] min-h-96 w-full overflow-auto rounded-md bg-white p-4 shadow-xl transition-all dark:bg-muted-800">
          <div>
            <BaseHeading className="h2" size="xl">
              Add Query
            </BaseHeading>
            <BaseParagraph size="sm">
              This sample demonstrates the default functionalities of the Query Builder control with
              importing and exporting the filter as JSON.
            </BaseParagraph>
          </div>
          <div className="mt-8">
            <QueryBuilder />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FilterQuery;
