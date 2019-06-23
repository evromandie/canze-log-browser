import m from 'mithril';
import sids from '../sids';
import Graph from './Graph';

let graphKey = 0;

export default {
  oninit(vnode) {
    vnode.state.logs = [];
    vnode.state.sidStats = {};
    vnode.state.graphs = [];

    vnode.state.addGraphFor = sid => {
      const logsToShow = vnode.state.logs.filter(log => log.sid === sid.sid);

      vnode.state.graphs.push({
        key: ++graphKey,
        sid,
        data: {
          x: logsToShow.map(log => log.time),
          y: logsToShow.map(log => log.value),
        },
      });
    };

    vnode.state.unknownSids = [];
  },
  view(vnode) {
    return m('.container', [
      m('input[type=file]', {
        onchange(event) {
          if (!event.target.files.length) {
            return;
          }
          const reader = new FileReader();
          reader.onload = event => {
            const text = event.target.result;
            console.log(text);

            vnode.state.sidStats = {};
            vnode.state.unknownSids = [];
            vnode.state.graphs = []; // Remove all graphs

            text.split('\n').forEach(row => {
              // Ignore empty lines
              if (row === '') {
                return;
              }

              const data = row.split(',');

              // Ignore header line
              if (data.length === 4 && data[1] === 'time' && data[2] === 'SID' && data[3] === 'value') {
                return;
              }

              if (data.length !== 3) {
                console.warn('Line of invalid length', row);
                return;
              }

              // Skip NaN values
              if (data[2] === 'NaN') {
                return;
              }

              const sid = data[1];

              if (!sid) {
                console.warn('Invalid SID', row);
                return;
              }

              const timeSegments = data[0].split('-');

              if (timeSegments.length !== 6) {
                console.warn('Invalid time', data[0]);
                return;
              }

              vnode.state.logs.push({
                time: new Date(...timeSegments),
                sid,
                value: data[2],
              });

              if (!vnode.state.sidStats[sid]) {
                vnode.state.sidStats[sid] = 1;
              } else {
                vnode.state.sidStats[sid]++;
              }
            });

            sids.forEach(sid => {
              if (vnode.state.sidStats[sid.sid]) {
                vnode.state.addGraphFor(sid);
              }
            });

            Object.keys(vnode.state.sidStats).forEach(key => {
              if (!sids.some(sid => sid.sid === key)) {
                vnode.state.unknownSids.push(key);
              }
            });

            m.redraw();
          };
          reader.onerror = error => {
            alert('Error reading file: ' + error);
          };
          reader.readAsText(event.target.files[0]);
        },
      }),
      m('table.table.table-sm', [
        m('thead', m('tr', [
          m('th', 'Name'),
          m('th', 'SID'),
          m('th', 'Count'),
          m('th', 'Add'),
        ])),
        m('tbody', sids.map(sid => m('tr', [
          m('td', sid.name),
          m('td', sid.sid),
          m('td', vnode.state.sidStats[sid.sid] || null),
          m('td', m('button.btn.btn-secondary[type=button]', {
            onclick() {
              vnode.state.addGraphFor(sid);
            },
          }, 'Add to graphs'))
        ]))),
      ]),
      (vnode.state.unknownSids.length ? [
        m('p', 'Unknown SIDs:'),
        m('ul', vnode.state.unknownSids.map(sid => m('li', m('code', sid)))),
      ] : null),
      m('.row', vnode.state.graphs.map(graph => m('.col-md-6.mt-3', m(Graph, graph)))),
    ]);
  },
}
