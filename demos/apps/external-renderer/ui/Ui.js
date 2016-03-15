define(["require", "exports", "react", "react-dom", "../../../components/App", "../../../components/View", "app/ExternalRendererApp"], function (require, exports, React, ReactDOM, App_1, View_1, ExternalRendererApp) {
    React;
    var Checkbox = require("material-ui/lib/checkbox");
    var List = require("material-ui/lib/lists/list");
    var ListItem = require("material-ui/lib/lists/list-item");
    var Toggle = require("material-ui/lib/toggle");
    var Slider = require("material-ui/lib/slider");
    var RefreshIndicator = require("material-ui/lib/refresh-indicator");
    require("./Ui.scss");
    var Ui = (function () {
        function Ui() {
        }
        Ui.prototype.run = function () {
            var _this = this;
            this.app = new ExternalRendererApp(function () {
                _this.ready = true;
                _this.render();
            });
            this.render();
        };
        Ui.prototype.render = function () {
            ReactDOM.render((React.createElement(App_1.default, {title: "4.0 External renderer: Fishing Lakes", sidebar: this.renderSidebar()}, React.createElement(View_1.default, {view: this.app.view}), this.renderSplash())), document.getElementById("content"));
        };
        Ui.prototype.renderSplash = function () {
            if (this.ready) {
                return;
            }
            return (React.createElement("div", {id: "splash"}, React.createElement("img", {src: "./textures/splash-blurred.png"}), React.createElement("div", {id: "progress"}, React.createElement(RefreshIndicator, {left: 0, top: 0, status: "loading", style: { position: "relative" }}))));
        };
        Ui.prototype.renderSidebar = function () {
            var _this = this;
            return (React.createElement("div", null, React.createElement(List, {subheader: "Water settings"}, React.createElement(ListItem, {primaryText: "Simulated", rightToggle: React.createElement(Toggle, {defaultToggled: this.app.simulatedWaterEnabled, onToggle: function (ev, value) { return _this.simulateWaterToggled(value); }})})), React.createElement("div", {className: "list-item"}, React.createElement("div", {className: "title"}, "Velocity"), React.createElement(Slider, {onChange: function (ev, value) { return _this.velocityChanged(value); }, value: this.app.waterVelocity, style: { marginBottom: 0, marginTop: 6, marginLeft: 6 }})), React.createElement("div", {className: "list-item"}, React.createElement("div", {className: "title"}, "Wave size"), React.createElement(Slider, {onChange: function (ev, value) { return _this.waveSizeChanged(value); }, value: this.app.waveSize, style: { marginBottom: 0, marginTop: 6, marginLeft: 6 }})), React.createElement(List, {subheader: "Information"}), React.createElement("div", {id: "lake-information"})));
        };
        Ui.prototype.velocityChanged = function (value) {
            this.app.waterVelocity = value;
        };
        Ui.prototype.waveSizeChanged = function (value) {
            this.app.waveSize = value;
        };
        Ui.prototype.simulateWaterToggled = function (value) {
            this.app.simulatedWaterEnabled = value;
        };
        return Ui;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ui;
});
