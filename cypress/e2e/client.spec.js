import { article } from "../support/page-objects/Article";
import { login } from "../support/page-objects/Login";

describe('API Testing', () => {

  beforeEach("Login to client", () => {
    // cy.intercept("GET", "https://conduit-api.bondaracademy.com/api/tags", {
    //   fixture: "tags.json"
    // });
    cy.intercept({ method: "GET", path: "tags" }, { fixture: "tags.json" }).as("getTags");
    // cy.login("hansi@horsti.de", "Hansi123");
    login.loginHeadLessly(Cypress.env("username"), Cypress.env("password"));
  });

  it('should send a correct request and receive a correct response', () => {
    cy.log("Login worked!");
    cy.intercept("POST", `${Cypress.env("apiUrl")}/articles/`).as("postArticle");
    
    const newArticle = {
      "title": "Hansi legt vor!" + new Date().toISOString(),
      "description": "Über den Hansi und wie er die Welt verändert",
      "body": "Nun ist es soweit. Der Hansi hat genug. Er nimmt es nun selbst in die Hand.",
      "tags": "Hansi Welt"
    };
    article.create(newArticle);

    cy.wait("@postArticle");
    cy.get("@postArticle").then($xhr => {
      console.log($xhr);
      expect($xhr.response.statusCode).equal(201);
      expect($xhr.response.body.article.title).equal(newArticle.title);
      expect($xhr.response.body.article.description).equal(newArticle.description);
      expect($xhr.response.body.article.body).equal(newArticle.body);
      const slug = $xhr.response.body.article.slug;
      article.deleteBySlug(slug);
    });
  });

  it('should intercept and modify the request and receive a correct response', () => {
    cy.intercept({ method: "POST", path: "articles" }, (req) => {
      req.body.article.title += new Date().toISOString();
    }).as("postArticle");
    
    const newArticle = {
      "title": "Hansi legt vor!",
      "description": "Über den Hansi und wie er die Welt verändert",
      "body": "Nun ist es soweit. Der Hansi hat genug. Er nimmt es nun selbst in die Hand.",
      "tags": "Hansi Welt"
    };
    article.create(newArticle);
    cy.wait("@postArticle");
    cy.get("@postArticle").then($xhr => {
      console.log($xhr);
      expect($xhr.response.statusCode).equal(201);
      expect($xhr.response.body.article.title).contains(newArticle.title);
      expect($xhr.response.body.article.description).equal(newArticle.description);
      expect($xhr.response.body.article.body).equal(newArticle.body);
    
    });
  });

  it("should display popular tags", () => {

    cy.log("Successfully logged in ...");
    cy.wait("@getTags");
    cy.fixture("tags.json").then(fix => {
      cy.get("div.tag-list")
        .find(".tag-pill")
        .should("have.length", fix.tags.length)
        .and("contain", fix.tags[0])
        .and("contain", fix.tags[fix.tags.length - 1]);
    });
  });

  it("should properly display global feeds 'like' count", () => {

    const yourFeed = {
      "articles": [],
      "articlesCount": 0
    };

    cy.intercept("GET", `${Cypress.env("apiUrl")}/articles/feed?limit=10&offset=0`, yourFeed);
    cy.intercept("GET", `${Cypress.env("apiUrl")}/articles?limit=10&offset=0`, {
      fixture: "globalFeed.json"
    });

    cy.contains("Global Feed").click();
    // cy.get("app-article-list button").then(buttons => {
    //   expect(buttons[0]).contain("1");
    //   expect(buttons[1]).contain("5");
    // });

    // -- check that counter in button text corresponds to fixture input
    cy.fixture("globalFeed.json").then(feed => {
      for (let i = 0; i < feed.articlesCount; i++) {
        cy.get("app-article-list button")
          .its(i)
          .should("contain", feed.articles[i].favoritesCount);
      }
    });
  });

  it("should properly increase global feeds 'like' count", () => {

    const yourFeed = {
      "articles": [],
      "articlesCount": 0
    };

    cy.intercept("GET", `${Cypress.env("apiUrl")}/articles/feed?limit=10&offset=0`, yourFeed);
    cy.intercept("GET", `${Cypress.env("apiUrl")}/articles?limit=10&offset=0`, {
      fixture: "globalFeed.json"
    });

    cy.fixture("globalFeed.json").then(feed => {
      const slugId = feed.articles[1].slug;
      const url = `${Cypress.env("apiUrl")}/articles/${slugId}/favorite`;
      const favoritesCount = feed.articles[1].favoritesCount + 1;
      feed.articles[1].favoritesCount = favoritesCount;
      cy.intercept("POST", url, feed).as("postFavorite");
      cy.get("app-favorite-button button").last().click();
      // cy.wait("@postFavorite");
      cy.get("app-favorite-button button").last().should("contain", favoritesCount);
    });
    
  });

  it("should login and delete an article using cy.request", { browser: "!edge" }, () => {
    login.getAuthToken(Cypress.env("username"), Cypress.env("password"));
    cy.get("@authToken").then(token => {

    });
  });

  it("should login and delete an article using cy.request - in CHROME ONLY", { browser: "chrome" }, () => {
    login.getAuthToken(Cypress.env("username"), Cypress.env("password"));
    cy.get("@authToken").then(token => {

    });
  });
});