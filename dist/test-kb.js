"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kb_service_1 = require("./kb/kb.service");
const kb = new kb_service_1.KBService();
(async () => {
    await kb.generateForRepo("test/test-repo");
    const pages = await kb.listPages("test/test-repo");
    console.log("KB Pages:", pages);
})();
