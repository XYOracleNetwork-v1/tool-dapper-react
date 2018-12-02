import React, { Component } from "react"
import  { Div } from "glamorous"

class DeployToNetwork extends Component  {
  render() {
    if (this.props.validNetwork === true) {
      return null
    }
    return (
      <Div>
        <Div
          css={{
            color: `#4D4D5C`,
            backgroundColor: `#FF6161`,
            width: `100%`,
            padding: 10,
          }}
        >
          No contracts deployed at the ABI source. Would you like to deploy to the {this.props.currentNetwork} network?
        </Div>
        {/* <Redirect to="/settings" /> */}
      </Div>
    )
  }
 
}

export default DeployToNetwork