import { useState, useMemo, useCallback } from "react";
import React from "react";
import normalizedData from "./normalizedData";

// 1. MEMOIZED CHILD ELEMENT COMPONENT
const CheckBoxItem = React.memo(
  ({ data, originalData, selectedMap, onToggle }) => {
    const { id, label, children } = data;

    // O(1) instantaneous lookup speed using a Set
    const isChecked = selectedMap.has(id);

    return (
      <div style={{ marginLeft: "20px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onToggle(id)}
          />
          {label}
        </label>

        {children && children.length > 0 && (
          <div className="child">
            {children.map((child) => (
              <CheckBoxItem
                key={child.id}
                data={child}
                originalData={originalData}
                selectedMap={selectedMap}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

// 2. PARENT CONTROLLER COMPONENT
const NestedCheckBox = ({ data }) => {
  // FIX: Normalize the tree data EXACTLY ONCE unless the source payload structure changes
  const normalisedData = useMemo(() => normalizedData(data), [data]);

  // FIX: Use a Set structure for instant lookups
  const [selectedMap, setSelectedMap] = useState(() => new Set());

  // FIX: Single pass event handler wrapped in useCallback to prevent child rerenders
  const handleToggle = useCallback(
    (id) => {
      setSelectedMap((prevSet) => {
        const nextSet = new Set(prevSet);
        const targetNode = normalisedData[id];
        if (!targetNode) return prevSet;

        const isSelecting = !nextSet.has(id);

        // Helper function to recursively capture all lower descendant branches
        const toggleDescendants = (nodeId, checkValue) => {
          const node = normalisedData[nodeId];
          if (!node) return;
          if (checkValue) nextSet.add(nodeId);
          else nextSet.delete(nodeId);
          node.childIds?.forEach((childId) =>
            toggleDescendants(childId, checkValue)
          );
        };

        // 1. Update target and all down-stream children
        toggleDescendants(id, isSelecting);

        // 2. Travel upwards and verify parent nodes status lines
        let parentId = targetNode.parent;
        while (parentId !== null && parentId !== undefined) {
          const parentNode = normalisedData[parentId];
          if (!parentNode) break;

          // Evaluates target array items natively without looping complex filters
          const allChildrenChecked = parentNode.childIds.every((childId) =>
            nextSet.has(childId)
          );

          if (allChildrenChecked) {
            nextSet.add(parentId);
          } else {
            nextSet.delete(parentId);
          }
          parentId = parentNode.parent; // Move upwards to next tree generation level
        }

        return nextSet;
      });
    },
    [normalisedData]
  );

  return (
    <>
      {data.map((ele) => (
        <CheckBoxItem
          key={ele.id}
          data={ele}
          originalData={normalisedData}
          selectedMap={selectedMap}
          onToggle={handleToggle}
        />
      ))}
    </>
  );
};

export default NestedCheckBox;
