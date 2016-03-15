import * as React from "react";
React;

const injectTapEventPlugin = require("react-tap-event-plugin") as () => void;
injectTapEventPlugin();

require("./App.scss");

import * as MUI from "material-ui";

const AppBar = require<typeof MUI.AppBar>("material-ui/lib/app-bar");
const LeftNav = require<typeof MUI.LeftNav>("material-ui/lib/left-nav");

const IconMenu = require<typeof MUI.IconMenu>("material-ui/lib/menus/icon-menu");
const NavigationMoreVert = require<any>("material-ui/lib/svg-icons/navigation/more-vert");
const MenuItem = require<typeof MUI.MenuItem>("material-ui/lib/menus/menu-item");
const IconButton = require<typeof MUI.IconButton>("material-ui/lib/icon-button");

interface AppProps extends React.Props<App> {
  title: string;
  sidebar?: React.ReactElement<any>;
}

interface AppState {
  leftNavOpen: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props?: AppProps) {
    super(props);

    this.state = {
      leftNavOpen: true
    };
  }

  render() {
    return (
      <div id="app">
        <AppBar
          className="header"
          title={this.props.title}
          onLeftIconButtonTouchTap={() => this.toggleMenu()}
          iconElementRight={null}
        />
        <LeftNav width={400} className="sidebar" open={this.state.leftNavOpen}>
        { this.props.sidebar }
        </LeftNav>
        {this.props.children}
      </div>
    );
  }

  private open(url: string) {
    document.location.href = "../" + url;
  }

  private toggleMenu() {
    this.setState(s => {
      s.leftNavOpen = !s.leftNavOpen;
      return s;
    });
  }
}
