import "./styles.css";
//import NestedCheckBox from "./NestedCheckBox";
import NestedCheckBox from "./gemini";

const data = [
  {
    id: 1,
    label: "check 1",
    children: [
      {
        id: 2,
        label: "check 1.1",
      },
      {
        id: 3,
        label: "check 1.2",
      },
    ],
  },
  {
    id: 4,
    label: "check 2",
    children: [
      {
        id: 5,
        label: "check 2.1",
      },
      {
        id: 6,
        label: "check 2.2",
        children: [
          {
            id: 7,
            label: "check 2.2.1",
          },
          {
            id: 8,
            label: "check 2.2.2",
          },
          {
            id: 9,
            label: "check 2.2.3",
          },
        ],
      },
    ],
  },
  {
    id: 10,
    label: "check 3",
    children: [
      {
        id: 11,
        label: "check 3.1",
      },
      {
        id: 12,
        label: "check 3.2",
      },
    ],
  },
];
export default function App() {
  return (
    <div className="App">
      <NestedCheckBox data={data}></NestedCheckBox>
    </div>
  );
}
