import { login } from "./Login";

export class Article {

    create(article) {
        cy.contains(/new article/i).click();
        cy.get("input[formcontrolname=title]").type(article.title);
        cy.get("input[formcontrolname=description]").type(article.description);
        cy.get("textarea[formcontrolname=body]").type(article.body);
        cy.get("input[placeholder='Enter tags']").type(article.tags);
        cy.get("button").contains(/publish article/i).click();
    }

    deleteBySlug(slug) {
        // login.getAuthToken("hansi@horsti.de", "Hansi123");
        cy.get("@authToken").then(token => {
            cy.request({
                method: "DELETE",
                url: "https://conduit-api.bondaracademy.com/api/articles/" + slug,
                headers: { "Authorization": "Token " + token }
            }).then(res => {
                expect(res.status).equal(204);
            });
        });
    }
}

export const article = new Article();