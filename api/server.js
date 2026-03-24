const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// 🔥 OVERRIDE RESPONSE
router.render = (req, res) => {
    const data = res.locals.data;

    const query = Object.fromEntries(new URLSearchParams(req._parsedUrl.query));

    const page = Number(query._page);
    const limit = Number(query._per_page);

    // kalau ada pagination → bungkus
    if (page || limit) {
        const total = Number(res.getHeader("X-Total-Count")) || data.length;
        const currentPage = page || 1;
        const perPage = limit || data.length;
        const pages = Math.ceil(total / perPage);

        return res.json({
            first: 1,
            prev: currentPage > 1 ? currentPage - 1 : null,
            next: currentPage < pages ? currentPage + 1 : null,
            last: pages,
            pages,
            items: total,
            data: data,
        });
    }

    // 🔥 TANPA pagination → tetap bungkus (biar konsisten)
    return res.json(data);
};

server.use(router);

server.listen(3000, () => {
    console.log("JSON Server is running");
});
