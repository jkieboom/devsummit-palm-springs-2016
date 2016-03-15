import * as React from "react";
React;

import * as ReactDOM from "react-dom";

import App from "../../../components/App";
import View from "../../../components/View";

import ExternalRendererApp = require("app/ExternalRendererApp");

import * as MUI from "material-ui";

const Checkbox = require<typeof MUI.Checkbox>("material-ui/lib/checkbox");
const List = require<typeof MUI.List>("material-ui/lib/lists/list");
const ListItem = require<typeof MUI.ListItem>("material-ui/lib/lists/list-item");
const Toggle = require<typeof MUI.Toggle>("material-ui/lib/toggle");
const Slider = require<typeof MUI.Toggle>("material-ui/lib/slider");
const RefreshIndicator = require<typeof MUI.RefreshIndicator>("material-ui/lib/refresh-indicator");

require("./Ui.scss");

export default class Ui {
  app: ExternalRendererApp;
  ready: boolean;

  constructor() {
  }

  run() {
    this.app = new ExternalRendererApp(() => {
      this.ready = true;
      this.render();
    });

    this.render();
  }

  render() {
    ReactDOM.render((
      <App title="4.0 External renderer: Fishing Lakes" sidebar={this.renderSidebar()}>
        <View view={this.app.view}/>
        {this.renderSplash()}
      </App>
    ), document.getElementById("content"));
  }

  private renderSplash() {
    if (this.ready) {
      return;
    }

    return (
      <div id="splash">
        <img src="./textures/splash-blurred.png"/>
        <div id="progress">
          <RefreshIndicator left={0} top={0} status="loading" style={{position: "relative"}}/>
        </div>
     </div>
    );
  }

  private renderSidebar() {
    return (
      <div>
        <List subheader="Water settings">
          <ListItem
            primaryText="Simulated"

            rightToggle={
              <Toggle
                defaultToggled={this.app.simulatedWaterEnabled}
                onToggle={(ev, value) => this.simulateWaterToggled(value)}
              />
            }
          />
        </List>
        <div className="list-item">
          <div className="title">Velocity</div>
          <Slider onChange={(ev, value) => this.velocityChanged(value)} value={this.app.waterVelocity} style={{ marginBottom: 0, marginTop: 6, marginLeft: 6 }}/>
        </div>
        <div className="list-item">
          <div className="title">Wave size</div>
          <Slider onChange={(ev, value) => this.waveSizeChanged(value) } value={this.app.waveSize} style={{ marginBottom: 0, marginTop: 6, marginLeft: 6 }}/>
        </div>
        <List subheader="Information"/>
        <div id="lake-information"/>
     </div>
    );
  }

  private velocityChanged(value: number) {
    this.app.waterVelocity = value;
  }

  private waveSizeChanged(value: number) {
    this.app.waveSize = value;
  }

  private simulateWaterToggled(value: boolean) {
    this.app.simulatedWaterEnabled = value;
  }
}
