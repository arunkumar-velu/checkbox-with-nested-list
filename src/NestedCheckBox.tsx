import { DataContext } from "./App";
import normalizedData from "./normalizedData";
import { useState, useMemo } from "react";
const CheckBox = ({
  data,
  parent,
  originalData,
  selectedMap,
  setSelectedMap,
}) => {
  let children = data.children;
  const checkBoxClicked = () => {
    const id = data.id;
    let ids = [...selectedMap];
    // on selecting the checkbox
    if (!ids.includes(id)) {
      ids.push(id);
      ids = [...ids, ...originalData[id].childIds];
      const parentId = originalData[id].parent;
      const parent = originalData[parentId];
      if (parent && parent.childIds) {
        let selectParent = parent.childIds.every(
          (c) => selectedMap.includes(c) || c == id
        );
        if (selectParent) {
          ids.push(parentId);
          ids.push(...parent.childIds);
        }
      }
    } else {
      // on unselecting the checkbox
      ids = [...ids.filter((d) => d !== id)];
      ids = [...ids.filter((e) => !originalData[id].childIds.includes(e))];
      const parentId = originalData[id].parent;
      const parent = originalData[parentId];
      if (parent && parent.childIds) {
        let isemtpy = parent.childIds.some((e) => !ids.includes(e));
        if (isemtpy) {
          ids = [...ids.filter((d) => d !== parentId)];
        }
      }
    }

    // setSelectedMap((prev) => {
    //   if (prev.includes(id)) {
    //     return [...prev.filter((d) => d != id)];
    //   } else {
    //     return [...prev, id];
    //   }
    // });
    // const parentId = originalData[id].parent;
    // const parent = originalData[parentId];

    // if (parent && parent.childIds) {
    //   console.log(parent.childIds, selectedMap);
    //   let selectParent = parent.childIds.every(
    //     (c) => selectedMap.includes(c) || c == id
    //   );
    //   console.log(selectParent);
    //   if (selectParent) {
    //     setSelectedMap((prev) => [...prev, parentId]);
    //   }
    // }
    console.log(ids);
    setSelectedMap(() => [...ids]);
  };
  const isChecked = useMemo(() => {
    console.log(selectedMap);
    return selectedMap.includes(data.id);
  }, [selectedMap]);
  return (
    <div>
      <input
        type="checkbox"
        onChange={checkBoxClicked}
        checked={isChecked}
        data-id={data.id}
      />
      <label> {data.label}</label>
      <div className="child">
        {children?.map((c) => {
          return (
            <div key={c.label}>
              <CheckBox
                data={c}
                originalData={originalData}
                selectedMap={selectedMap}
                setSelectedMap={setSelectedMap}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getChildren = (data, parent = null) => {
  const chidren = Object.entries(data).filter((ele) => {
    return ele[1].parent == parent;
  });
  return chidren;
};
const NestedCheckBox = ({ data }) => {
  const normalisedData = normalizedData(data);
  const [selectedMap, setSelectedMap] = useState([]);
  return (
    <>
      {data.map((ele) => {
        return (
          <div key={ele.label}>
            <CheckBox
              data={ele}
              originalData={normalisedData}
              selectedMap={selectedMap}
              setSelectedMap={setSelectedMap}
            />
          </div>
        );
      })}
    </>
  );
};
export default NestedCheckBox;
