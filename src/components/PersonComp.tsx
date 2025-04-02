import React, { memo } from "react";

type propsType = {
  personID: number;
  personCoordX: number;
  personCoordY: number;
  personName: string;
  addNewPerson: any;
};

let PersonComp = memo(function PersonComp(props: propsType) {
  // console.log(props.personID, props.personCoordX, props.personCoordY);
  return (
    <div
      onClick={() => props.addNewPerson(props.personID)}
      className="node"
      style={{
        top: `${props.personCoordY}px`,
        left: `${props.personCoordX}px`,
      }}
    >
      {props.personName}
    </div>
  );
});

export default PersonComp;
