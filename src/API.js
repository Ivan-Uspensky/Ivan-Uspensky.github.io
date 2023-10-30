import { generateData, generateColors } from "./DataTable/mockedData";

// export function fakeFetch(rows, subRows) {
export const fakeFetch = (url, {rows, subRows}) => {
  return new Promise((resolve) => {
    const delay = 1000 + Math.random() * 1000;

    setTimeout(() => {
      let result;
      if (url === "/data") {
        result = generateData(rows, subRows);
      } 
      if (url === "/colors") {
        result = generateColors();
      } 

      resolve(result);
    }, delay);
  });
}
