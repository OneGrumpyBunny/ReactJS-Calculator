import React from 'react';
import Buttons from './Buttons';

const buttonIsNumber = /[0123456789]/;
const isOperator = /[/x+‑]/;
const endsWithOperator = /[x+/‑]$/;
const endsWithNegativeSign = /[x/+‑]$/;
const clearStyle = { background: "#ac3939" };
const operatorStyle = { background: "#666666" };
const equalsStyle = {
    background: "#004466",
    position: "absolute",
    height: 130,
    bottom: 5
  };

class App extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
        numberSet: buttonSets.numbers,
        operatorSet: buttonSets.operators,
        equalSet: buttonSets.equals,
        currentVal: "0",
        prevVal: "0",
        formula: "",
        currentSign: "pos",
        lastClicked: "",
        evaluated: 'false'          
    }   
    
    this.calculate = this.calculate.bind(this); 
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.initialize = this.initialize.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);  
  }  
  
  maxDigitWarning() {
    this.setState({
      currentVal: "Digit Limit Met",
      prevVal: this.state.currentVal
    });
    setTimeout(() => this.setState({ currentVal: this.state.prevVal }), 1000);
  }

  
  calculate(val) {
    // is operator     
    if (isOperator.test(val) && !this.state.currentVal.includes("Limit")) {     
      this.handleOperators(val);    
    }
    
    // is number    
    if (buttonIsNumber.test(val) && !this.state.currentVal.includes("Limit")) {
      this.handleNumbers(val);
    }
    
    // if decimal
    if (val === '.') {
      this.handleDecimal();
    }
    
    if (val === '=') {
      this.handleEvaluate();
    }
    
    if (val === 'c') {
      this.initialize();
    }
  }
  
  handleEvaluate() {
    if (!this.state.currentVal.includes("Limit")) {
      let expression = this.state.formula;
      //console.log("Evaluating " + expression);
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression.replace(/\x/g, "*").replace(/‑/g, "-");
      //console.log("expression: " + expression);
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      this.setState({
        currentVal: answer.toString(),
        formula:
          expression.replace(/-/g, "‑") + "=" + answer,
        prevVal: answer,
        evaluated: true
      });
    }
  }

  
  handleOperators(val) {
    if (!this.state.currentVal.includes("Limit")) {  
      const value = val;
      const { formula, prevVal, evaluated } = this.state;
      this.setState({ currentVal: value, evaluated: false });
            
      if (evaluated) {
        this.setState({ formula: prevVal + value });
        } else if (!endsWithOperator.test(formula)) {        
          this.setState ({          
            prevVal: formula,
            formula: formula + value
          });
        
        } else if (!endsWithNegativeSign.test(formula)) {
          this.setState({
            formula:  (endsWithNegativeSign.test(formula + value) ? formula : prevVal) + value
          }) 

        } else if (value !== "‑") {
          this.setState ({            
            formula: prevVal + value
          });
                
        } else {
           this.setState ({            
            formula: formula + value
          });
       }
    }
  }
      
        
  handleNumbers(val) {
    if (!this.state.currentVal.includes("Limit")) {
      const { currentVal, formula, evaluated } = this.state;
      const value = val;
      this.setState({ evaluated: false });
      if (currentVal.length > 21) {
        this.maxDigitWarning();
      } else if (evaluated) {
        this.setState({
          currentVal: value,
          formula: value !== "0" ? value : ""
        });
      } else {
        this.setState({
          currentVal:
            currentVal === "0" || isOperator.test(currentVal)
              ? value
              : currentVal + value,
          formula:
            currentVal === "0" && value === "0"
              ? formula === "" ? value : formula
              : /([^.0-9]0|^0)$/.test(formula)
                ? formula.slice(0, -1) + value
                : formula + value
        });
      }
    }
  }

  handleDecimal() {
    if (this.state.evaluated === true) {
      this.setState({
        currentVal: "0.",
        formula: "0.",
        evaluated: false
      });
    } else if (
      !this.state.currentVal.includes(".") &&
      !this.state.currentVal.includes("Limit")
    ) {
      this.setState({ evaluated: false });
      if (this.state.currentVal.length > 21) {
        this.maxDigitWarning();
      } else if (
        endsWithOperator.test(this.state.formula) ||
        (this.state.currentVal === "0" && this.state.formula === "")
      ) {
        this.setState({
          currentVal: "0.",
          formula: this.state.formula + "0."
        });
      } else {
        this.setState({
          currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
          formula: this.state.formula + "."
        });
      }
    }
  }

  initialize() {
    this.setState({
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
      evaluated: false
    });
}
  
  render() {    
    const styles = {className:'display formula'};
    //console.log("RENDER: currentVal: " + this.state.currentVal + " | Formula: " + this.state.formula + " | prevVal: " + this.state.prevVal + " | evaluated: " + this.state.evaluated);
    return(
      <div className="Header">
        <h1>Calculator!</h1>
        <p>Press numbers on the left to see the calculation on the right.</p>   
        <div className="leftCol">
          <Buttons 
            buttonset = {this.state.numberSet}
            calculate = {this.calculate}/>
        </div>
        <div className="rightCol">
          <Buttons 
            buttonset = {this.state.operatorSet}
            calculate = {this.calculate}/>
          <input value={this.state.formula} id="formula" className={styles.className} />       
          <input value={this.state.currentVal} id="display" className="display"/>
          <Buttons 
            buttonset = {this.state.equalSet}
            calculate = {this.calculate}/>
        </div>
      </div>
    );
  }
}

const buttonSets = {
  equals: [
      {
      id: 'equals',
      class: 'equal',
      value: '=',
      action: 'equals'
      }
  ],
  operators: [
      {
      id: 'divide',
      class: 'operator1',
      value: '/',
      action: 'divide'
      },
      {
      id: 'multiply',
      class: 'operator2',
      value: 'x',
      action: 'multiply'
      },
      {
      id: 'add',
      class: 'operator3',
      value: '+',
      action: 'add'
      },
      {
      id: 'subtract',
      class: 'operator4',
      value: '‑',
      action: 'subtract'
      }
  ],
  numbers: [ 
      {
      id: 'one',
      value: '1',
      class: 'number1'    
      },
      {
      id: 'two',
      value: '2',
      class: 'number2'
      },
      {
      id: 'three',
      value: '3',
      class: 'number3'
      },
      {
      id: 'four',
      value: '4',
      class: 'number4'
      },
      {
      id: 'five',
      value: '5',
      class: 'number5'
      },
      {
      id: 'six',
      value: '6',
      class: 'number6'
      },
      {
      id: 'seven',
      value: '7',
      class: 'number7'
      },
      {
      id: 'eight',
      value: '8',
      class: 'number8'
      },
      {
      id: 'nine',
      value: '9',
      class: 'number9'
      },
      {
      id: 'zero',
      value: '0',
      class: 'number0'
      },
      {
      id: 'decimal',
      value: '.',
      class: 'numberdec'
      },
      {
      id: 'clear',
      value: 'c',
      class: 'numberclear'
      }
  ]
};

export default App;
