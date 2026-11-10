import 'server-only';
import mongoose from 'mongoose';

// One connection per server process. Cached on globalThis so dev HMR (which re-evaluates modules) and warm
// serverless invocations reuse the same connection instead of opening a new pool each time.
const cache = (globalThis.__spotifyForCarMongoose ??= { conn: null, promise: null });

export async function connectDb() {
	// Mongoose reconnects a dropped connection on its own (and buffers queries meanwhile), so a resolved
	// connection stays reusable.
	if (cache.conn) return cache.conn;

	if (!cache.promise) {
		const uri = process.env.DB_CONNECT;
		if (!uri) throw new Error('DB_CONNECT is not set');
		cache.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
	}

	try {
		cache.conn = await cache.promise;
	} catch (err) {
		// Let the next call retry instead of caching the failure forever.
		cache.promise = null;
		cache.conn = null;
		throw err;
	}
	return cache.conn;
}
