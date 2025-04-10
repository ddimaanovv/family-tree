import { personType } from "../types/personType";

const LOB = 100;
const LBB = 50;

export default function addChild(
  parentID: number,
  currentMassPersons: personType[]
): Array<personType> {
  let newPerson: personType = {
    id: Date.now(),
    name: "noName",
    level: 0,
    coordX: 0,
    coordY: 0,
    seqNumber: 0,
    isDirect: true,
    birthday: 2005,
    sibling: [],
    spouse: [],
    children: [],
  };

  let parent = currentMassPersons.find((elem) => elem.id === parentID);
  if (parent) {
    parent.children.push(newPerson.id);
    newPerson.level = parent.level - 1;
    // let massRelatives = currentMassPersons.filter(
    //   (elem) => elem.level === newPerson.level
    // );

    // if (massPersonAtCurrentLevel) {
    //   let massCoordXAtCurrentLevel = massPersonAtCurrentLevel.map(
    //     (person) => person.coordX
    //   );
    //   let parentCoordX = Math.min(...massCoordXAtCurrentLevel);
    //   // if ()
    // }

    let massPossibleCoordX = [parent.coordX];
    if (parent.spouse.length) {
      let spouse = currentMassPersons.find(
        (elem) => elem.id === parent?.spouse[0]
      );
      if (spouse !== undefined) {
        massPossibleCoordX.push(spouse.coordX);
        spouse.children.push(newPerson.id);
      }
    }
    let parentCoordX = Math.min(...massPossibleCoordX);

    let countChild = parent.children.length;
    if (countChild > 0) {
      parent.children.forEach((childId) => {
        let child = currentMassPersons.find((elem) => elem.id === childId);
        if (child) {
          child.coordX = child.coordX - (LOB + LBB) / 2;
        }
        newPerson.sibling.push(childId);
      });
    }
    newPerson.coordX =
      parentCoordX + ((LOB + LBB) * (parent.spouse.length + countChild)) / 2;
    newPerson.coordY = parent.coordY + (LOB + LBB);
  }

  let copyOfCurrentMassPersons = [...currentMassPersons, newPerson];
  return copyOfCurrentMassPersons;
}
