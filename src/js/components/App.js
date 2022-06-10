import m from 'mithril';
import sids from '../sids';
import Plotly from 'plotly.js-dist';
import LogFile from '../models/LogFile';
import SID from '../models/SID';

export default {
  oninit(vnode) {
    vnode.state.plotTypeLine = true;
    vnode.state.availableMetrics = {};
    vnode.state.unknownSids = [];
    vnode.state.plotlyLoaded = false;
    vnode.state.visibleSids = [ // Values visible by default after loading a file
      '7ec.6233de.24', // Trip B meter
      '7ec.6233dd.24', // Trip B energy
    ];
    vnode.state.files = [];

    vnode.state.updateAvailableData = () => {
      const visibleLogFiles = vnode.state.files.filter(file => file.visible);

      vnode.state.availableMetrics = {};
      vnode.state.unknownSids = [];

      visibleLogFiles.forEach(file => {
        Object.keys(file.sidCounts).forEach(sid => {
          if (!vnode.state.availableMetrics[sid]) {
            vnode.state.availableMetrics[sid] = file.sidCounts[sid];
          } else {
            vnode.state.availableMetrics[sid] += file.sidCounts[sid];
          }

          if (!SID.exists(sid)) {
            vnode.state.unknownSids.push(sid);
          }
        });
      });

    };

    vnode.state.updateGraph = () => {
      const visibleLogFiles = vnode.state.files.filter(file => file.visible);

      const data = [];
      const yaxis = [];

      vnode.state.visibleSids.forEach(sid => {
        const logs = [].concat(...visibleLogFiles.map(file => file.logs.filter(log => log.sid === sid)));

        if (!logs.length) {
          return;
        }

        let name = sid;
        let unit = 'unknown';

        const sidData = sids.find(s => s.sid === sid);

        if (sidData) {
          name = sidData.name;

          if (sidData.unit) {
            unit = sidData.unit;
            name += ' (' + unit + ')';
          }
        }

        let yAxisIndex = yaxis.findIndex(u => u === unit);

        // Create one axis per unit
        if (yAxisIndex === -1) {
          yAxisIndex = yaxis.length;
          yaxis.push(unit);
        }

        const trace = {
          name,
          x: logs.map(log => log.time),
          y: logs.map(log => log.value),
          yaxis: 'y' + (yAxisIndex + 1),
        };

        if (vnode.state.plotTypeLine) {
          trace.type = 'line';
        } else {
          trace.mode = 'markers';
        }

        data.push(trace);
      });

      if (data.length) {

        const layout = {
          uirevision: 'true', // Must be same value between redraws to preserve
          xaxis: {
            title: 'Time',
          },
        };

        yaxis.forEach((unit, index) => {
          layout['yaxis' + (index + 1)] = {
            title: unit,
            //anchor: 'x',
            overlaying: index > 0 ? 'y' : 'free',
            side: index % 2 === 0 ? 'left' : 'right',
          };
        });

        Plotly.react(vnode.dom.querySelector('.plotly'), data, layout).then(() => {
          vnode.state.plotlyLoaded = true;
          m.redraw();
        });
      } else {
        Plotly.purge(vnode.dom.querySelector('.plotly'));
        vnode.state.plotlyLoaded = false;
      }
    };
  },
  view(vnode) {
    return m('div', [
      m('nav.navbar.navbar-expand-lg.navbar-dark.bg-primary.mb-2', [
        m('a[href=#].navbar-brand', 'CanZE Log Browser'),
        m('span.navbar-text', 'Brought to you by EV Romandie')
      ]),
      m('.container-fluid', [
        m('.row', [
          m('.col-md-3.metrics-list', [
            sids.map(sid => {
              const availableCount = vnode.state.availableMetrics[sid.sid];

              if (!availableCount) {
                return null;
              }

              const isVisibleOnGraph = vnode.state.visibleSids.indexOf(sid.sid) !== -1;

              return m('button.btn.btn-block.btn-sm', {
                className: isVisibleOnGraph ? 'btn-primary' : 'btn-light',
                onclick() {
                  if (isVisibleOnGraph) {
                    vnode.state.visibleSids = vnode.state.visibleSids.filter(s => s !== sid.sid);
                  } else {
                    vnode.state.visibleSids.push(sid.sid);
                  }

                  vnode.state.updateGraph();
                },
              }, m('.row', [
                m('.col-md-6', sid.name),
                m('.col-md-3', availableCount),
                m('.col-md-3', sid.unit),
              ]));
            }),
            Object.keys(vnode.state.availableMetrics).length === 0 ? m('.jumbotron', m('p', 'Available metrics will appear here')) : null,
            (vnode.state.unknownSids.length ? [
              m('p', 'Unknown SIDs:'),
              vnode.state.unknownSids.map(sid => {
                const isVisibleOnGraph = vnode.state.visibleSids.indexOf(sid) !== -1;

                return m('button.btn.btn-block.btn-sm', {
                  className: isVisibleOnGraph ? 'btn-primary' : 'btn-light',
                  onclick() {
                    if (isVisibleOnGraph) {
                      vnode.state.visibleSids = vnode.state.visibleSids.filter(s => s !== sid);
                    } else {
                      vnode.state.visibleSids.push(sid);
                    }

                    vnode.state.updateGraph();
                  },
                }, sid);
              }),
            ] : null),
          ]),
          m('.col-md-9', [
            vnode.state.plotlyLoaded ? null : m('.jumbotron.ploty-placeholder', vnode.state.files.length ? [
              m('h1', 'Select metrics for the graph to appear'),
            ] : [
              m('h1', 'Welcome to CanZE Log Browser'),
              m('p', 'Here\'s how to use this tool:'),
              m('ol', [
                m('li', ['In the ', m('a[href=https://canze.fisch.lu/]', 'CanZE'), ' application, go to "Settings" > "Save traces on SD card" > Select "Fields".']),
                m('li', 'Leave the app open or running in the background to collect the data. The data saved is different depending on the CanZE tab used.'),
                m('li', 'CanZE will save the file at "CanZE/field-YYYY-MM-DD-hh-mm-ss.log" on the device.'),
                m('li', 'Get the file and upload it here.'),
                m('li', 'The panel on the left will list the metrics available in the log file. Click on the metrics to add them to the graph.'),
                m('li', 'Enjoy :)'),
              ]),
              m('p', 'All of the data is parsed locally, nothing is sent to our servers. This service is not affiliated with CanZE.'),
            ]),
            m('.plotly'),
            m('.mt-3', [
              'Plot type ',
              m('.btn-group', [
                m('.btn.btn-secondary', {
                  className: vnode.state.plotTypeLine ? 'active' : null,
                  onclick() {
                    vnode.state.plotTypeLine = true;
                    vnode.state.updateGraph();
                  },
                }, 'Line'),
                m('.btn.btn-secondary', {
                  className: vnode.state.plotTypeLine ? null : 'active',
                  onclick() {
                    vnode.state.plotTypeLine = false;
                    vnode.state.updateGraph();
                  },
                }, 'Scatter'),
              ]),
              m('button.btn.btn-light', {
                onclick() {
                  vnode.state.visibleSids = [];
                  vnode.state.updateGraph();
                },
              }, 'Remove all metrics from graph'),
            ]),
            m('h3', 'Loaded files'),
            m('.row', [
              vnode.state.files.map((file, index) => m('.col-md-4', m('.card', {
                className: file.visible ? 'border-primary' : null,
              }, m('.card-body', [
                m('h6', file.filename),
                m('p', file.logs.length + ' rows'),
                m('div', [
                  m('button.btn.btn-sm.btn-light', {
                    onclick() {
                      file.visible = !file.visible;
                      vnode.state.updateAvailableData();
                      vnode.state.updateGraph();
                    },
                  }, file.visible ? 'Hide' : 'Show'),
                  m('button.btn.btn-sm.btn-danger', {
                    onclick() {
                      vnode.state.files.splice(index, 1);
                      vnode.state.updateAvailableData();
                      vnode.state.updateGraph();
                    },
                  }, 'Remove'),
                ]),
              ])))),
              m('.col-md-4', m('.card', m('.card-body', [
                m('h6', 'Load file'),
                m('input[type=file]', {
                  onchange(event) {
                    if (!event.target.files.length) {
                      return;
                    }
                    const fileName = event.target.files[0].name;
                    const reader = new FileReader();
                    reader.onload = event => {
                      const text = event.target.result;
                      console.log(text);

                      const file = new LogFile(fileName);
                      file.read(text, sids);

                      vnode.state.files.push(file);

                      vnode.state.updateAvailableData();
                      vnode.state.updateGraph();

                      m.redraw();
                    };
                    reader.onerror = error => {
                      alert('Error reading file: ' + error);
                    };
                    reader.readAsText(event.target.files[0]);
                  },
                }),
              ]))),
            ]),
            m('p.text-muted.text-center.mt-3', [
              'This free tool was created by ',
              m('a[href=https://evromandie.ch/]', 'EV Romandie'),
              ' and is not affiliated with the CanZE developers. Open-source code hosted on ',
              m('a[href=https://github.com/evromandie/canze-log-browser]', 'GitHub'),
            ]),
          ]),
        ]),
      ]),
    ]);
  },
}
