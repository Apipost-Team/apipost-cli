const
	Readable          = require('stream').Readable,
	kLineObjectStream = Symbol('line object stream');


module.exports = function(stream) {
	stream[Symbol.asyncIterator] = function() {
		if ( ! this[kLineObjectStream]) {
			const readable = new Readable({
				objectMode: true,
				read: () => {
					this.resume();
				},
				destroy: (err, cb) => {
					this.off('line', lineListener);
					this.off('close', closeListener);

					if (this.close) {
						this.close();
					}

					stream.destroy()

					cb(err);
				}
			});
			
			const lineListener = (row) => {
				if ( ! readable.push(row)) {
					this.pause();
				}
			};
			const closeListener = () => {
				
				readable.push(null);
			};
			
			this.on('data', lineListener);
			this.on('close', closeListener);
			this[kLineObjectStream] = readable;
		}
		
		return this[kLineObjectStream][Symbol.asyncIterator]();
	};
	
	
	return stream;
};