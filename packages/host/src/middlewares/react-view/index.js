const fs= require('fs');
const { resolve } = require('path');
const Handlebars = require('handlebars')

const { renderToString, renderToStaticMarkup } = require('react-dom/server');
const Gloabl = require('@changecoder/global');
const { Header, Footer } = Gloabl.default || Gloabl
const { createElement } = require('react');
const { deepCopy } = require('../../utils');

class ReactView {
    constructor() {
        this.render = this.render.bind(this);
        this.register = this.register.bind(this);
        this.renderModule = this.renderModule.bind(this);
        this.renderHtml = this.renderHtml.bind(this);
        this.addStyle = this.addStyle.bind(this);
        this.addScript = this.addScript.bind(this);
        this.addWidgetBundle = this.addWidgetBundle.bind(this);
        this.init = this.init.bind(this);
        this.init()
    }

    init() {
        const view = this;
        fs.readFile(resolve(__dirname, 'index.html'), {encoding:'utf-8'}, function (err,data) {
            view.htmlString = data
        });
    }

    render() {
        const view = this;
        return async function({title, module = {}}) {
            view.title = title;
            try {
                view.header = await view.renderModule(Header);
                view.footer = await view.renderModule(Footer);
                view.content = await view.renderModule(module);
                this.body = view.renderHtml();
            } catch(error) {
                this.body = JSON.stringify(error);
            }
        }
    }

    async renderModule({widget, mode, id, preload, params}) {
        if(!widget) {
            return '';
        }
        let renderString;
        let element;
        let data;
        switch(mode) {
            case 'server':
                if (preload) {
                    data = await preload({ context: this.context, data: params});
                    element = createElement(widget, {data});
                } else {
                    element = createElement(widget);
                }
                renderString = renderToStaticMarkup(element);
                break;
            case 'both':
                if (preload) {
                    data = await preload({ context: this.context, data: params});
                    const newData = deepCopy(data);
                    element = createElement(widget, {data: newData});
                } else {
                    element = createElement(widget);
                }
                renderString = renderToString(element);
                if (data) {
                    renderString = renderString.replace(`id="${id}"`, `id="${id}" data-data='${JSON.stringify(data)}'`);
                }
                break;
            case 'client':
                renderString = params ? `<div id=${id} data-params=${JSON.stringify(params)}></div>` : `<div id=${id}></div>`;
                break;
            default: 
                renderString = '';
        }
        this.addWidgetBundle(id, mode);
        return renderString;
    }

    addWidgetBundle(id, mode) {
        if (mode !== 'server') {
            this.addScript(`changecoder.${id}`)
        }
        this.addStyle(`changecoder.${id}`)
    }

    addStyle(name) {
        this.links = this.links || []
        if (!this.links.includes(name)) {
            this.links.push(name)
        }
    }

    addScript(name) {
        this.scripts = this.scripts || []
        if (!this.scripts.includes(name)) {
            this.scripts.push(name)
        }
    }

    renderHtml() {
        const template = Handlebars.compile(this.htmlString)
        const { title = 'ChangeCoder', header, content, footer, scripts, links } = this
        return template({
            title, 
            header, 
            footer,
            content,
            scripts,
            links
        });
    }

    register() {
        const view = this;
        const dispatch = async (ctx, next) => {
            ctx.render = view.render();
            return next();
        }
        return dispatch;
    }
}

module.exports = ReactView