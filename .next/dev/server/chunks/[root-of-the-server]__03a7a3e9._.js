module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/pages/api/entries.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DATA = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), 'data', 'entries.json');
async function read() {
    try {
        const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].promises.readFile(DATA, 'utf8');
        return JSON.parse(raw || '[]');
    } catch (e) {
        return [];
    }
}
async function write(list) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].promises.mkdir(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(DATA), {
        recursive: true
    });
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].promises.writeFile(DATA, JSON.stringify(list, null, 2), 'utf8');
}
async function handler(req, res) {
    if (req.method === 'GET') {
        const list = await read();
        // newest first
        list.sort((a, b)=>new Date(b.created_at) - new Date(a.created_at));
        return res.status(200).json(list);
    }
    if (req.method === 'POST') {
        try {
            const { type, targetName, message } = req.body;
            if (!type || !message) return res.status(400).json({
                error: 'type and message required'
            });
            const allowed = [
                'compliments',
                'confessions',
                'captions'
            ];
            if (!allowed.includes(type)) return res.status(400).json({
                error: 'invalid type'
            });
            const list = await read();
            const entry = {
                id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
                type,
                targetName: targetName || null,
                message: String(message).slice(0, 1000),
                created_at: new Date().toISOString()
            };
            list.unshift(entry);
            await write(list);
            return res.status(201).json(entry);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                error: 'server error'
            });
        }
    }
    res.setHeader('Allow', 'GET,POST');
    res.status(405).end('Method Not Allowed');
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03a7a3e9._.js.map