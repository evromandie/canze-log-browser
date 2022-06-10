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

  read(text, sidRepository = []) {
    let handledSids = [];

    text.split('\n').forEach(row => {
      // Ignore empty lines
      if (row === '') {
        return;
      }

      const data = row.split(',');

      // New header format
      if (row === 'Datetime,SID,Name,Value,Unit') {
        return;
      }

      // Old header format
      // Ignore header line. Header has one more column because the time is added before the list of columns
      // "YYYY-MM-DD-hh-mm-ss,time,SID,value"
      if (data.length === 4 && data[LOG_FILE_TIME_INDEX + 1] === 'time' && data[LOG_FILE_SID_INDEX + 1] === 'SID' && data[LOG_FILE_VALUE_INDEX + 1] === 'value') {
        return;
      }

      // Old format is like "YYYY-MM-DD-hh-mm-ss,aaa.bbb.ccc,100"
      // New format is like "YYYYMMDDhhmmssmmm,aaa.bbb.ccc,UserFriendlyName,100,Unit"
      if (data.length !== 3 && data.length !== 5) {
        console.warn('Line of invalid length', row);
        return;
      }

      const valueIndex = data.length === 5 ? 3 : LOG_FILE_VALUE_INDEX;

      // Skip NaN values
      if (data[valueIndex] === 'NaN') {
        return;
      }

      const sid = data[LOG_FILE_SID_INDEX];

      if (!sid) {
        console.warn('Invalid SID', row);
        return;
      }

      if (data.length === 5 && handledSids.indexOf(sid) === -1) {
        const sidLabel = data[2];

        const repositoryIndex = sidRepository.findIndex(entry => entry.sid === sid);
        const unit = data[4] || undefined; // Cast empty string to undefined so it doesn't set a key below

        if (repositoryIndex === -1) {
          console.info('Importing unknown SID ' + sid + ' with label "' + sidLabel + '" / unit ' + unit);
          sidRepository.push({sid, name: sidLabel, unit});
        } else if (sidRepository[repositoryIndex].name !== sidLabel) {
          console.info('Replacing entry for ' + sid + ' "' + sidRepository[repositoryIndex].name + '" with label "' + sidLabel + '" / unit ' + unit);
          sidRepository[repositoryIndex].name = sidLabel;
          if (unit) {
            sidRepository[repositoryIndex].unit = unit;
            delete sidRepository[repositoryIndex].transform;
          }
        }

        handledSids.push(sid);
      }

      let timeString; // Not actually used, just to benefit from the spread operator
      let timeSegments;

      if (data.length === 5) {
        [timeString, ...timeSegments] = /^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{3})$/.exec(data[LOG_FILE_TIME_INDEX]);
      } else {
        timeSegments = data[LOG_FILE_TIME_INDEX].split('-');
      }

      if (timeSegments.length < 6 || timeSegments.length > 7) {
        console.warn('Invalid time', data[LOG_FILE_TIME_INDEX]);
        return;
      }

      this.logs.push(new LogEntry(
        new Date(timeSegments[0], timeSegments[1] - 1 /* month from 1-based to 0-based */, timeSegments[2], timeSegments[3], timeSegments[4], timeSegments[5], timeSegments.length === 7 ? timeSegments[6] : 0),
        sid,
        SID.transform(sid, data[valueIndex])
      ));

      if (!this.sidCounts[sid]) {
        this.sidCounts[sid] = 1;
      } else {
        this.sidCounts[sid]++;
      }
    });
  }
}
