import { Tab, TabGroup, TabList } from '@headlessui/react';
import React, { useEffect } from 'react';
import Tag from '../tag/Tag';
import ListBox from '../form/listbox/Listbox';
import { usePathname, useRouter } from 'next/navigation';

const Tabs = ({
  data,
  selectedItem,
  setSelectedItem,
  notSetUrl = false
}: {
  data: { name: string; count?: number }[];
  selectedItem: any;
  setSelectedItem: any;
  notSetUrl?: boolean;
}) => {
  const router = useRouter();
  const path = usePathname();
  const handleSelectTab = (tabItem: any) => {
    setSelectedItem(tabItem);
    if (tabItem?.href && !notSetUrl) router.push(path + tabItem?.href);
    else return;
  };
  useEffect(() => {
    !notSetUrl && selectedItem?.href && router.push(path + selectedItem?.href);
  }, [notSetUrl, path, router, selectedItem]);
  return (
    <div>
      <TabGroup className="hidden rounded-md bg-muted-100 px-2 dark:bg-gray-800 md:block">
        <TabList className="custom__scrollbar flex overflow-x-auto">
          {data.map((item: any) => (
            <Tab
              onClick={() => handleSelectTab(item)}
              key={item.name}
              className="flex items-center gap-2 whitespace-nowrap border-4 border-transparent px-3 py-1 text-sm text-gray-600 hover:bg-slate-200 focus:outline-none data-[selected]:border-b-4 data-[selected]:border-b-primary-500 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              {item.name}
              {item.count && (
                <Tag variant="solid" shape="rounded">
                  {item.count}
                </Tag>
              )}
            </Tab>
          ))}
        </TabList>
      </TabGroup>

      <div className="block md:hidden">
        <ListBox
          selected={selectedItem}
          setSelected={setSelectedItem}
          items={data}
          classNames="z-[4]"
        />
      </div>
    </div>
  );
};

export default Tabs;
