import license from "./cc-license.js";
if (!window.$docsify.plugins) window.$docsify.plugins = []
window.$docsify.plugins.push(function plugin(hook) {
    let footer;
    try {
        const config = window.$docsify['cc-license']
        footer = license[config.lang || 'zh'][config.commercial][config.derivatives]['license_html']
    } catch {

        console.warn(`cc - license插件中的config没有写好哦 ! 您可以在$docsify中填入`)
        console.warn(`'cc-license': {
            lang: 'zh',
            //zh en ja
            commercial: 'y',
            // y or n 允许对您的作品进行商业性使用吗？
            derivatives: 'y',
            // y or n or sa 允许您的作品的演绎作品被共享吗？ sa 表示 是的，只要他人以相同方式共享
        }`)
        footer = ''
    }

    hook.afterEach(function (html) {
        return html + ` < div class = 'docsify-cc-license' > $ {
            footer
        } < /div>`;
    });
})
