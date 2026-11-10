// Navigation uses real routes and previously visited routes stay in the DOM
// hidden (display: none), so selectors are scoped to the nav / visible elements.
describe('demo page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Demo Room').click()
  })

  it('demo page', () => {
    cy.contains("Demo's Room").should('be.visible')
    cy.location("pathname").should("equal", "/demo")
  })

  it('queue view', () => {
    cy.get("li:visible").eq(0).contains("Runaway (U & I)")
    cy.get("li:visible").eq(1).contains("vampire")
  })

  it('add song from search view', () => {
    cy.get("nav").contains("Search").click()
    cy.get("input:visible").type("test drive")
    cy.get("ul:visible").eq(0).contains("TEST DRIVE").click()
    cy.contains("Song Added")
    cy.contains("TEST DRIVE has been added to the queue!")
    cy.get("nav").contains("Queue").click()
    cy.get("li:visible").eq(1).contains("TEST DRIVE")
  })

  it('add song from my library view', () => {
    cy.get("nav").contains("My Library").click()
    cy.contains("a:visible", "Your Top Songs 2018").click()
    cy.get("li:visible").eq(1).contains("Girls Like You (feat. Cardi B) - Cardi B Version").click()
    cy.contains("Song Added")
    cy.contains("Girls Like You (feat. Cardi B) - Cardi B Version has been added to the queue!")
    // On a playlist page the bottom bar is a single "My Library" back link
    cy.get("nav").contains("My Library").click()
    cy.get("nav").contains("Queue").click()
    cy.get("li:visible").eq(1).contains("Girls Like You (feat. Cardi B) - Cardi B Version")
  })

})
