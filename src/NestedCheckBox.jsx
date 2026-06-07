import normalizedData from "./normalizedData";
import { useMemo, useState } from "react";

const CheckBox = ({ node, normalizedInfo, selectedMap, toggleSelection }) => {
  const isSelected = selectedMap.has(node.id);
  const onChange = () => {
    toggleSelection(node);
  };
  return (
    <div className="children">
      <label>
        <input type="checkbox" checked={isSelected} onChange={onChange} />
        {node.label}
      </label>
      {node.children &&
        node.children.map((child) => {
          return (
            <CheckBox
              key={child.label}
              node={child}
              normalizedInfo={normalizedInfo}
              selectedMap={selectedMap}
              toggleSelection={toggleSelection}
            />
          );
        })}
    </div>
  );
};

const NestedCheckBox = ({ data }) => {
  const [selectedMap, setSelectedMap] = useState(() => new Set());
  const normalizedInfo = useMemo(() => normalizedData(data));
  const toggleSelection = (node) => {
    setSelectedMap((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(node.id)) {
        newSet.delete(node.id);
      } else {
        newSet.add(node.id);
      }
      const toggleDesentChild = (tNode) => {
        tNode.children &&
          tNode.children.forEach((cNode) => {
            newSet.has(tNode.id)
              ? newSet.add(cNode.id)
              : newSet.delete(cNode.id);
            cNode.children && toggleDesentChild(cNode);
          });
      };
      toggleDesentChild(node);
      let parent = normalizedInfo[node.id].parent;
      while (parent) {
        let isAllChecked = normalizedInfo[parent]?.childIds?.every((child) =>
          newSet.has(child)
        );
        if (isAllChecked) {
          newSet.add(parent);
        } else {
          newSet.delete(parent);
        }
        parent = normalizedInfo[parent].parent;
      }
      return newSet;
    });
  };
  return (
    <>
      {data.map((node) => (
        <CheckBox
          node={node}
          key={node.label}
          normalizedInfo={normalizedInfo}
          selectedMap={selectedMap}
          toggleSelection={toggleSelection}
        />
      ))}
    </>
  );
};
export default NestedCheckBox;
