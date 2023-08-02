describe('demo page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Demo Room').click()
  })

  it('demo page', () => {
    cy.contains("Demo's Room")
    cy.location("pathname").should("equal", "/demo")
  })

  it('queue view', () => {
    cy.get("li").eq(0).contains("Runaway (U & I)")
    cy.get("li").eq(1).contains("vampire")
  })

  it('add song from search view', () => {
    cy.contains("Search").click()
    cy.get("input").type("test drive")
    cy.get("ul").eq(0).contains("TEST DRIVE").click()
    cy.contains("Song Added")
    cy.contains("TEST DRIVE has been added to the queue!")
    cy.contains("Queue").click()
    cy.get("li").eq(1).contains("TEST DRIVE")
  })

  it('add song from my library view', () => {
    cy.contains("My Library").click()
    cy.contains("Your Top Songs 2018").click()
    cy.get("li").eq(1).contains("Girls Like You (feat. Cardi B) - Cardi B Version").click()
    cy.contains("Song Added")
    cy.contains("Girls Like You (feat. Cardi B) - Cardi B Version has been added to the queue!")
    cy.contains("My Library").click()
    cy.contains("Queue").click()
    cy.get("li").eq(1).contains("Girls Like You (feat. Cardi B) - Cardi B Version")
  })

})