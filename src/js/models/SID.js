import sids from '../sids';

export default {
  exists(key) {
    return sids.some(s => s.sid === key);
  },
  transform(key, value) {
    const sid = sids.find(s => s.sid === key);

    if (sid && sid.transform) {
      return sid.transform(value);
    }

    return value;
  }
}
