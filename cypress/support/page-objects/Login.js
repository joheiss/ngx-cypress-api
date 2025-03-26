export class Login {

    
    loginHeadLessly(email, password) {
        const creds = { user: { email: email, password: password } };
        cy.request("POST", `${Cypress.env("apiUrl")}/users/login`, creds)
        .its("body").then(body => {
            const token = body.user.token;
            cy.wrap(token).as("authToken");
            cy.visit("/", {
                onBeforeLoad(win) {
                    win.localStorage.setItem("jwtToken", token);
                }
            });
        });
    }

    logout() {
        cy.contains("Settings").click();
        cy.contains("Or click here to logout").click();
        cy.get(".navbar-nav").should("contain","Sign up");
    }

    getAuthToken(email, password) {
        const creds = { user: { email: email, password: password } };
        cy.request("POST", `${Cypress.env("apiUrl")}/users/login`, creds)
        .its("body").then(body => {
            const token = body.user.token;
            cy.wrap(token).as("authToken");
            cy.log("Token: " + token);
        }).as("postLogin")

        // cy.get("@postLogin").then(res => {
        //     const token = res.body.user.token;
        //     cy.wrap(token).as("authToken");
        //     cy.log("Token: " + token);
        // });
    }
}

export const login = new Login();