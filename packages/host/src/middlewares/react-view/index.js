const fs= require('fs');
const { resolve } = require('path');
const Handlebars = require('handlebars')

const { renderToString, renderToStaticMarkup } = require('react-dom/server');
const { Header, Footer } = require('@changecoder/global');
const { createElement } = require('react');
const { deepCopy } = require('../../utils');

export default class ReactView {
    constructor() {
        this.render = this.render.bind(this);
        this.register = this.register.bind(this);
        this.renderWidget = this.renderWidget.bind(this);
        this.createHtml = this.createHtml.bind(this);
        this.renderHtml = this.renderHtml.bind(this);
        this.addStyle = this.addStyle.bind(this);
        this.addScript = this.addScript.bind(this);
        this.addWidgetBundle = this.addWidgetBundle.bind(this);
        this.renderLayout = this.renderLayout.bind(this);
        this.init = this.init.bind(this);
    }

    init() {
        this.links = [];
        this.scripts = [];
        this.metas = [];
        fs.readFile(resolve(__dirname, 'index.html'), {encoding:'utf-8'}, function (err,data) {
            this.htmlString = data
        });
        this.renderLayout();
    }

    renderLayout() {
        this.renderModule(Header).then(result => this.header = result)
        this.renderModule(Footer).then(result => this.footer = result)
    }

    render() {
        const view = this;
        return async function({title, widget, params}) {
            view.title = title;
            try {
                this.content = await view.renderModule(widget, this, params);
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
        if (!this.links.includes(name)) {
            this.links.push(name)
        }
    }

    addScript(name) {
        if (!this.scripts.includes(name)) {
            this.scripts.push(name)
        }
    }

    renderHtml() {
        const template = Handlebars.compile(this.htmlString)
        const { title = 'ChangeCoder', links = [], scripts = [], metas = [] } = this
        return template({
            title, 
            links, 
            scripts, 
            metas
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