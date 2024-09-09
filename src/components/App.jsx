import React, { useState } from "react";
import Calculator from "./Calculator";
import Display from "./Display";
import ButtonsContainer from "./ButtonsContainer";
import Buttons from "./Buttons";

const buttons = [
  ["AC", "+-", "/"],
  [7, 8, 9, "*"],
  [6, 5, 4, "-"],
  [3, 2, 1, "+"],
  [0, ".", "="],
];

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

function App() {
  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0,
  });

  function numberHandler(e) {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value),
        res: !calc.sign ? "0" : calc.res,
      });
    }
  }

  function resetHandler(e) {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  }

  function signHandler(e) {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      sign: value,
      res: calc.res && calc.num ? calc.num : calc.res,
      num: 0,
    });
  }

  function invertHandler() {
    setCalc({
      ...calc,
      sign: "",
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
    });
  }

  function equalHandler() {
    if (calc.sign && calc.num) {
      const math = (x, y, sign) =>
        sign === "*"
          ? x * y
          : sign === "/"
          ? x / y
          : sign === "+"
          ? x + y
          : x - y;

      setCalc({
        ...calc,
        sign: "",
        num: 0,
        res:
          calc.num === "0" && calc.sign === "/"
            ? "Can't divide with 0"
            : toLocaleString(
                math(
                  Number(removeSpaces(calc.res)),
                  Number(removeSpaces(calc.num)),
                  calc.sign
                )
              ),
      });
    }
  }

  function commaHandler(e) {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  }

  return (
    <Calculator>
      <Display value={calc.num ? calc.num : calc.res} />
      <ButtonsContainer>
        {buttons.flat().map((button, index) => {
          return (
            <Buttons
              key={index}
              value={button}
              className={
                button === "=" ? "equal" : button === "AC" ? "clear" : ""
              }
              onClick={
                // console.log(`${button} clicked`);
                button === "AC"
                  ? resetHandler
                  : button === "+-"
                  ? invertHandler
                  : button === "/" ||
                    button === "*" ||
                    button === "-" ||
                    button === "+"
                  ? signHandler
                  : button === "="
                  ? equalHandler
                  : button === "."
                  ? commaHandler
                  : numberHandler
              }
            />
          );
        })}
      </ButtonsContainer>
    </Calculator>
  );
}

export default App;