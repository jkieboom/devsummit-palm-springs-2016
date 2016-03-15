var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react"], function (require, exports, React) {
    React;
    var injectTapEventPlugin = require("react-tap-event-plugin");
    injectTapEventPlugin();
    require("./App.scss");
    var AppBar = require("material-ui/lib/app-bar");
    var LeftNav = require("material-ui/lib/left-nav");
    var App = (function (_super) {
        __extends(App, _super);
        function App(props) {
            _super.call(this, props);
            this.state = {
                leftNavOpen: true
            };
        }
        App.prototype.render = function () {
            var _this = this;
            return (React.createElement("div", {id: "app"}, React.createElement(AppBar, {className: "header", title: this.props.title, onLeftIconButtonTouchTap: function () { return _this.toggleMenu(); }}), React.createElement(LeftNav, {width: 400, className: "sidebar", open: this.state.leftNavOpen}, this.props.sidebar), this.props.children));
        };
        App.prototype.toggleMenu = function () {
            this.setState(function (s) {
                s.leftNavOpen = !s.leftNavOpen;
                return s;
            });
        };
        return App;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = App;
});
