import SID from './SID';

const LOG_FILE_TIME_INDEX = 0;
const LOG_FILE_SID_INDEX = 1;
const LOG_FILE_VALUE_INDEX = 2;

class LogEntry {
  constructor(time, sid, value) {
    this.time = time;
    this.sid = sid;
    this.value = value;
  }
}

export default class LogFile {
  constructor(filename) {
    this.filename = filename;
    this.logs = [];
    this.sidCounts = {};
    this.visible = true;
  }

  read(text) {
    text.split('\n').forEach(row => {
      // Ignore empty lines
      if (row === '') {
        return;
      }

      const data = row.split(',');

      // Ignore header line. Header has one more column because the time is added before the list of columns
      // "YYYY-MM-DD-hh-mm-ss,time,SID,value"
      if (data.length === 4 && data[LOG_FILE_TIME_INDEX + 1] === 'time' && data[LOG_FILE_SID_INDEX + 1] === 'SID' && data[LOG_FILE_VALUE_INDEX + 1] === 'value') {
        return;
      }

      // format is like "YYYY-MM-DD-hh-mm-ss,aaa.bbb.ccc,100"
      if (data.length !== 3) {
        console.warn('Line of invalid length', row);
        return;
      }

      // Skip NaN values
      if (data[LOG_FILE_VALUE_INDEX] === 'NaN') {
        return;
      }

      const sid = data[LOG_FILE_SID_INDEX];

      if (!sid) {
        console.warn('Invalid SID', row);
        return;
      }

      const timeSegments = data[LOG_FILE_TIME_INDEX].split('-');

      if (timeSegments.length !== 6) {
        console.warn('Invalid time', data[LOG_FILE_TIME_INDEX]);
        return;
      }

      this.logs.push(new LogEntry(
        new Date(timeSegments[0], timeSegments[1] - 1 /* month from 1-based to 0-based */, timeSegments[2], timeSegments[3], timeSegments[4], timeSegments[5]),
        sid,
        SID.transform(sid, data[LOG_FILE_VALUE_INDEX])
      ));

      if (!this.sidCounts[sid]) {
        this.sidCounts[sid] = 1;
      } else {
        this.sidCounts[sid]++;
      }
    });
  }
}
