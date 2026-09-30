import FlexTableRow from './ui/table/flexTable/FlexTableRow';
import FlexTableCell from './ui/table/flexTable/FlexTableCell';
import Checkbox from './ui/form/checkbox/Checkbox';
import ToggleBox from './ui/toggle-box/ToggleBox';
import { columnsJson } from './Tables/DynamicTable';
import { MemberGroup, MemberInfo } from './Tables/MyMembers/MyMembersTable';
import Avatar from './ui/avatar/Avatar';
import ToggleSwitch from './ui/form/toggle-switch/ToggleSwitch';
import { Tooltip } from './ui/tooltip/Tooltip';
import Button from './ui/button/Button';
import { ReIcon } from '../../components/ReIcon/ReIcon';
import InlineText from './microComponents/InlineText';
import MicroBadge from './microComponents/MicroBadge';
import React from 'react';
import MicroCheckbox from './microComponents/MicroCheckbox';
import AvatarGroup from './ui/avatar/AvatarGroup';
import { DateTimeFormatter } from './ui/date-time-formatter';
import { NumberFormatter } from './ui/numberFormatter';
import Image from 'next/image';
import MicroModal from './microComponents/MicroModal';

interface RenderTableRowProps {
  columns: any;
  records: (MemberInfo | MemberGroup)[];
  selectedItems: MemberInfo[];
  handleSelect: (item: MemberInfo) => void;
  handleSelectGroup: (group: MemberGroup) => void;
  bulkSelect?: boolean;
  action?: any;
}

const RenderTableRow = ({
  selectedItems,
  handleSelect,
  handleSelectGroup,
  columns,
  records,
  bulkSelect = true,
  action
}: RenderTableRowProps) => {
  return records.map((item, index) =>
    'groupItems' in item ? (
      <ToggleBox
        key={item.groupId}
        shape="curved"
        spaced="none"
        classes={{
          container: 'p-2 shadow-none mb-2'
        }}
        header={
          <div className="flex items-center gap-3 pl-2 dark:text-muted-400">
            <Checkbox
              onClick={(e) => {
                e.stopPropagation();
                handleSelectGroup(item);
              }}
              color="primary"
              checked={item.groupItems.every((groupItem) =>
                selectedItems.some((selectedItem) => selectedItem.id === groupItem.id)
              )}
            />
            <div className="font-semibold capitalize text-muted-500">{item.title}</div>
          </div>
        }
        open
      >
        {item.groupItems.map((gItem: MemberInfo) => (
          <SingleRow
            key={gItem.id}
            bulkSelect={bulkSelect}
            columns={columns}
            row={gItem}
            selectedItems={selectedItems}
            handleSelect={handleSelect}
            action={action}
          />
        ))}
      </ToggleBox>
    ) : (
      <SingleRow
        key={item.id}
        bulkSelect={bulkSelect}
        columns={columns}
        row={item}
        selectedItems={selectedItems}
        handleSelect={handleSelect}
        action={action}
      />
    )
  );
};

export default RenderTableRow;

// In SingleRow component
interface SingleRowProps {
  bulkSelect?: boolean;
  columns: any;
  row: any;
  selectedItems: MemberInfo[];
  handleSelect: (item: MemberInfo) => void;
  action?: any;
}

const SingleRow = ({
  bulkSelect,
  columns,
  row,
  selectedItems,
  handleSelect,
  action
}: SingleRowProps) => {
  return (
    <FlexTableRow rounded="md" className="mb-2 text-muted-700 dark:text-muted-300">
      {bulkSelect && (
        <FlexTableCell label="selection" type="shrink" className="flex-1 md:w-10 md:flex-none">
          <Checkbox
            shape="rounded"
            color="primary"
            checked={selectedItems.some((item) => item.id === row.id)}
            onChange={() => handleSelect(row)}
          />
        </FlexTableCell>
      )}
      {/* ... rest of the row rendering */}
      {/* {columns?.map((col, cIndex: number) => (
        <FlexTableCell
          key={cIndex}
          label={col?.label}
          type={col?.cellType}
          className={col?.cellClass}
        >
          {col?.render ? col?.render(row) : row[col?.accessor]}
        </FlexTableCell>
      ))} */}
      {columns &&
        columns?.column?.map((col: any, idx: number) => (
          <FlexTableCell key={idx} label={col.name} type="stable" className={col.class}>
            {col.group?.map((groupItem: any, gidx: number) => (
              <RenderGroup key={gidx} group={groupItem} recordRow={row} />
            ))}
          </FlexTableCell>
        ))}

      {/* action buttons  */}
      {action && (
        <FlexTableCell
          label="Actions"
          type="shrink"
          className="flex flex-1 items-center justify-between gap-3 md:justify-end md:gap-0"
        >
          {action ? (
            <>{typeof action === 'function' ? action(row) : action}</>
          ) : (
            <div className="flex justify-between gap-2">
              <Tooltip content="View Property">
                <Button
                  size="sm"
                  variant="pastel"
                  color="primary"
                  onClick={() => console.log(row, 'table selected row')}
                >
                  <ReIcon iconName="GrView" />
                </Button>
              </Tooltip>
              <Tooltip content="More">
                <Button size="sm" variant="pastel" color="success">
                  <ReIcon iconName="FaEllipsisV" />
                </Button>
              </Tooltip>
            </div>
          )}
        </FlexTableCell>
      )}
    </FlexTableRow>
  );
};

const RenderGroup = ({ group, recordRow }: any) => {
  return (
    <div className={group.class || ''}>
      <RenderFields fields={group.fields} recordRow={recordRow} />
    </div>
  );
};

const RenderFields = ({ fields, recordRow }: any) => {
  return (
    <>
      {fields?.map((fieldItem: any, fidx: any) => {
        if (fieldItem.type === 'data') {
          return <RenderCellContent key={fidx} fieldItem={fieldItem} recordRow={recordRow} />;
        } else if (fieldItem.type === 'group' && fieldItem.group) {
          return fieldItem.group.map((groupItem: any, gidx: any) => (
            <div key={gidx} className={groupItem.class || ''}>
              <RenderFields fields={groupItem.fields} recordRow={recordRow} />
            </div>
          ));
        }
        return null;
      })}
    </>
  );
};

const getNestedField = (object: any, path: string) => {
  const pathArray = path.split('.');
  let result = object;
  pathArray.forEach((key) => {
    result = result?.[key];
  });
  return result;
};

const RenderCellContent = ({ fieldItem, recordRow }: any) => {
  const value = getNestedField(recordRow, fieldItem.field);
  switch (fieldItem.component?.name) {
    case 'avatar':
      return <Avatar src={value} alt="avatar" size="xs" />;
    case 'text':
      return <InlineText text={value} {...fieldItem?.component} />;
    case 'ToggleSwitch':
      return <ToggleSwitch checked={value} />;
    case 'badge':
      return <MicroBadge text={value} {...fieldItem?.component} />;
    case 'checkbox':
      return (
        <MicroCheckbox row={recordRow} field={fieldItem.field} component={fieldItem?.component} />
      );
    case 'AvatarGroup':
      return <AvatarGroup avatars={value} {...fieldItem?.component} />;
    case 'date-time-formatter':
      return <DateTimeFormatter date={value} {...fieldItem?.component} />;
    case 'number-formatter':
      return <NumberFormatter prefix="$" value={value} {...fieldItem?.component} />;
    case 'img':
      return (
        <Image
          className="object-contain"
          width={500}
          height={500}
          alt={value}
          src={value}
          {...fieldItem?.component}
        />
      );
    case 'modal':
      return <MicroModal data={value} {...fieldItem?.component} />;

    default:
      return <span>{value || 'N/A'}</span>;
  }
};
