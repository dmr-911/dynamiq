import { ReIcon } from '../../components/ReIcon/ReIcon';
import BaseModal from './ui/BaseModal/BaseModal';
import IconButton from './ui/button-icon/IconButton';
import React, { useState } from 'react';
import MicroTable from './MicroTable';

const MicroModal = ({ data, ...rest }: { data: any; rest: any }) => {
  const [open, setOpen] = useState(false);

  const { title, tableView = false, config, filterOptions } = (rest as any) || {};

  const handleOpenModal = () => {
    setOpen(true);
  };
  return (
    <>
      <IconButton
        onClick={handleOpenModal}
        variant={'pastel'}
        color="primary"
        shape="smooth"
        title="Popup"
      >
        <ReIcon iconName="PiArrowSquareOutBold" />
      </IconButton>

      <BaseModal
        open={open}
        setOpen={setOpen}
        // @ts-ignore
        title={title}
        classes={{ main: 'overflow-hidden !w-auto' }}
      >
        {tableView && <MicroTable data={data} config={config} filterOptions={filterOptions} />}
      </BaseModal>
    </>
  );
};

export default MicroModal;
