import ads from "./src/js/App/Ads";
import article from "./src/js/App/Article";
import comments from "./src/js/App/Comments";
import common from "./src/js/App/Common";
import easyUI from "./src/js/App/EasyUI";
import friendLinks from "./src/js/App/FriendLinks";
import home from "./src/js/App/Home";
import login from "./src/js/App/Login";
import main from "./src/js/App/Main";
import mainMaster from "./src/js/App/MainMaster";
import merchant from "./src/js/App/Merchant";
import sysDic from "./src/js/App/SysDic";
import sysFunction from "./src/js/App/SysFunction";
import sysLog from "./src/js/App/SysLog";
import sysRole from "./src/js/App/SysRole";
import sysWebSetting from "./src/js/App/SysWebSetting";
import tags from "./src/js/App/Tags";
import userCenter from "./src/js/App/UserCenter";
import userControl from "./src/js/App/UserControl";
import userInfo from "./src/js/App/UserInfo";
import product from "./src/js/App/Product";

(window as any).xclcms = {
    Ads: ads,
    Article: article,
    Comments: comments,
    Common: common,
    EasyUI: easyUI,
    FriendLinks: friendLinks,
    Home: home,
    Login: login,
    Main: main,
    MainMaster: mainMaster,
    Merchant: merchant,
    SysDic: sysDic,
    SysFunction: sysFunction,
    SysLog: sysLog,
    SysRole: sysRole,
    SysWebSetting: sysWebSetting,
    Tags: tags,
    UserCenter: userCenter,
    UserControl: userControl,
    UserInfo: userInfo,
    Product: product
};