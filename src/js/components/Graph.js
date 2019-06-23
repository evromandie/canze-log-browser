import m from 'mithril';
import Plotly from 'plotly.js';

export default {
  oncreate(vnode) {
    Plotly.plot(vnode.dom.querySelector('.plotly'), [vnode.attrs.data]);
  },
  view(vnode) {
    const {sid} = vnode.attrs;

    return m('.card', m('.card-body', [
      m('h2', sid.name + ' (' + sid.sid + ')'),
      m('.plotly'),
    ]));
  },
}
