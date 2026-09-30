import React, { useState } from 'react';
import Button from './ui/button/Button';
import Input from './ui/form/input/Input';
import Select from './ui/form/select/Select';

const operators = [
  { label: 'Equals', value: 'equals' },
  { label: 'Not Equals', value: 'not equals' },
  { label: 'Greater Than', value: 'greater than' },
  { label: 'Less Than', value: 'less than' },
  { label: 'Contains', value: 'contains' },
  { label: 'Starts With', value: 'starts with' }
];

type Condition = {
  field: string;
  operator: string;
  value: string | number;
};

type Group = {
  id: string;
  logic: 'AND' | 'OR';
  conditions: Condition[];
  groups: Group[];
};

const initialCondition: Condition = {
  field: '',
  operator: '',
  value: ''
};

const initialGroup: Group = {
  id: 'root',
  logic: 'AND',
  conditions: [initialCondition],
  groups: []
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const QueryBuilder = () => {
  const [query, setQuery] = useState<Group>(initialGroup);

  // ADD CONDITION
  const addCondition = (groupId: string) => {
    const updateGroup = (group: Group): Group => {
      if (group.id === groupId) {
        return { ...group, conditions: [...group.conditions, { ...initialCondition }] };
      }
      return { ...group, groups: group.groups.map(updateGroup) };
    };
    setQuery((prevQuery) => updateGroup({ ...prevQuery }));
  };

  // ADD GROUP
  const addGroup = (groupId: string) => {
    const updateGroup = (group: Group): Group => {
      if (group.id === groupId) {
        return { ...group, groups: [...group.groups, { ...initialGroup, id: generateId() }] };
      }
      return { ...group, groups: group.groups.map(updateGroup) };
    };
    setQuery((prevQuery) => updateGroup({ ...prevQuery }));
  };

  // DELETE CONDITION
  const deleteCondition = (groupId: string, conditionIndex: number) => {
    const updateGroup = (group: Group): Group => {
      if (group.id === groupId) {
        const newConditions = [...group.conditions];
        newConditions.splice(conditionIndex, 1);
        return { ...group, conditions: newConditions };
      }
      return { ...group, groups: group.groups.map(updateGroup) };
    };
    setQuery((prevQuery) => updateGroup({ ...prevQuery }));
  };

  // DELETE GROUP
  const deleteGroup = (groupId: string) => {
    const updateGroup = (group: Group): Group => {
      return {
        ...group,
        groups: group.groups
          .map((subGroup) => updateGroup(subGroup))
          .filter((subGroup) => subGroup.id !== groupId)
      };
    };

    setQuery((prevQuery) => {
      if (prevQuery.id === groupId) {
        return initialGroup; // Or handle root group deletion in a specific way
      }
      return updateGroup(prevQuery);
    });
  };

  const handleConditionChange = (
    groupId: string,
    index: number,
    key: string,
    value: string | number
  ) => {
    const updateGroup = (group: Group): Group => {
      if (group.id === groupId) {
        const newConditions = [...group.conditions];
        newConditions[index] = { ...newConditions[index], [key]: value };
        return { ...group, conditions: newConditions };
      }
      return { ...group, groups: group.groups.map(updateGroup) };
    };
    setQuery((prevQuery) => updateGroup({ ...prevQuery }));
  };

  const handleLogicChange = (groupId: string, value: 'AND' | 'OR') => {
    const updateGroup = (group: Group): Group => {
      if (group.id === groupId) {
        return { ...group, logic: value };
      }
      return { ...group, groups: group.groups.map(updateGroup) };
    };
    setQuery((prevQuery) => updateGroup({ ...prevQuery }));
  };

  const renderGroup = (group: Group) => {
    return (
      <div className="border border-muted-200 dark:border-muted-700 p-2 rounded-md">
        {group.conditions.map((condition, index) => (
          <div key={index} className="flex my-2 gap-2 items-center">
            <Input
              type="text"
              size="sm"
              placeholder="Field"
              value={condition.field}
              onChange={(e) => handleConditionChange(group.id, index, 'field', e.target.value)}
            />
            <Select
              size="sm"
              value={condition.operator}
              onChange={(e) => handleConditionChange(group.id, index, 'operator', e.target.value)}
              className="p-2 border rounded-md"
              options={operators}
            />
            <Input
              type="text"
              size="sm"
              placeholder="Value"
              value={condition.value}
              onChange={(e) => handleConditionChange(group.id, index, 'value', e.target.value)}
            />
            <Button
              onClick={() => deleteCondition(group.id, index)}
              variant="outlined"
              color="error"
              size="sm"
            >
              Delete
            </Button>
          </div>
        ))}

        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => addCondition(group.id)}>
            Add Condition
          </Button>
          <Select
            size="sm"
            value={group.logic}
            onChange={(e) => handleLogicChange(group.id, e.target.value as 'AND' | 'OR')}
            options={[
              { label: 'AND', value: 'AND' },
              { label: 'OR', value: 'OR' }
            ]}
          />
          <Button size="sm" onClick={() => addGroup(group.id)}>
            Add Group
          </Button>
          {group.id !== 'root' && (
            <Button
              size="sm"
              onClick={() => deleteGroup(group.id)}
              variant="outlined"
              color="error"
            >
              Delete Group
            </Button>
          )}
        </div>

        {group.groups.map((subGroup) => (
          <div
            key={subGroup.id}
            className="ml-4 border-l border-muted-200 dark:border-muted-700 pl-4 mt-4"
          >
            {renderGroup(subGroup)}
          </div>
        ))}
      </div>
    );
  };

  const getOutput = () => {
    const convertGroupToOutput: any = (group: Group) => {
      const { logic, conditions, groups } = group;
      const rules = [
        ...conditions.map(({ field, operator, value }) => ({
          field,
          operator,
          value: typeof value === 'number' ? Number(value) : value
        })),
        ...groups.map(convertGroupToOutput)
      ];
      return { condition: logic.toLowerCase(), rules };
    };

    return JSON.stringify(convertGroupToOutput(query), null, 2);
  };

  return (
    <div>
      {renderGroup(query)}
      <pre className="mt-4 p-4 bg-gray-200 text-muted-800 dark:bg-gray-800 dark:text-muted-300 border border-muted-300 dark:border-muted-700 rounded-md">
        {getOutput()}
      </pre>
    </div>
  );
};

export default QueryBuilder;
