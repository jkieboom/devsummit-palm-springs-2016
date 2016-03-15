var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react"], function (require, exports, React) {
    React;
    var View = (function (_super) {
        __extends(View, _super);
        function View() {
            _super.call(this);
            this.id = Date.now().toString(16) + "-view-" + View.id++;
        }
        View.prototype.componentDidMount = function () {
            this.props.view.container = this.id;
        };
        View.prototype.render = function () {
            return React.createElement("div", {id: this.id});
        };
        View.id = 0;
        return View;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = View;
});
