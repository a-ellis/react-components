describe('components: Slider component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=slider--primary'));

  it('should render the component', () => {
    cy.findByRole('slider').should('be.visible');
  });
});
