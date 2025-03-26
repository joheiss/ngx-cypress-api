const { login } = require("../support/page-objects/Login");

describe("Testing logout ...", () => {

    beforeEach("Login headlessly", () => {
        login.loginHeadLessly("hansi@horsti.de", "Hansi123");
    });

    it("should logout successfully", { retries: 1 }, () => {
        login.logout();
    });
});