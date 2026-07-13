# TODO

- [ ] Remove EJS wiring from app.js (ejs-mate + view engine + views config)
- [ ] Replace res.render(error.ejs) with res.json(...) in app.js
- [ ] Convert controllers/listing.js render* functions from res.render to res.json
- [ ] Convert controllers/users.js render* functions from res.render to res.json
- [ ] Update app.js middleware that sets res.locals.* used for EJS (keep only if harmless; do not break auth)
- [ ] Update package.json to remove ejs and ejs-mate dependencies
- [ ] Delete entire views/ directory (EJS templates/partials/layouts)
- [ ] Run npm install and start server to verify boot
- [ ] Smoke test key endpoints: GET /listings and GET /listings/:id

