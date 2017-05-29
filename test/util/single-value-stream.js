'use strict';

const stream = require('stream');
const SingleValueStream = require('../../lib/util/single-value-stream');

describe('SingleValueStream', function () {
  it('pipes values through singleValue', function () {
    return new Promise((resolve, reject) => {
      let count = 0;

      const r = new stream.Readable({objectMode: true});
      r.on('error', reject);

      const w = new stream.Writable({objectMode: true});
      w.on('error', reject);
      w.on('finish', () => {
        assert.equal(count, 1);
        resolve();
      });

      w._write = (chunk, enc, next) => {
        assert.equal(chunk, 'value');
        count++;
        next();
      };

      r.pipe(new SingleValueStream()).pipe(w);
      r.push({field: 'value'});
      r.push(null);
    });
  });
});
