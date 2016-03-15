import * as React from "react";
React;

interface ViewProps {
  view: any;
}

export default class View extends React.Component<ViewProps, {}> {
  id: string;

  private container: HTMLElement;

  constructor() {
    super();

    this.id = `${Date.now().toString(16)}-view-${View.id++}`;
  }

  componentDidMount() {
    this.props.view.container = this.id;
  }

  render() {
    return <div id={this.id}/>;
  }

  private static id: number = 0;
}
