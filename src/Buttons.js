import React from 'react';


class Buttons extends React.Component {
    constructor(props) {
      super(props);      
    } 
    
    render() {
      const calcButtons = this.props.buttonset.map((i) => {
        return(
          <div id={i.id} 
              className={i.class} 
              title={i.id} 
              keyCode={i.value}
              onClick={() => {this.props.calculate(i.value)}}>
              {i.value}
          </div>
        )
      });       
      
        return(
          <div>
            {calcButtons}
          </div>
        ) 
      }
    }

    
export default Buttons;