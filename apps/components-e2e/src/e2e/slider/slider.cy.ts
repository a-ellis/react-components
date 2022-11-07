describe('components: Slider component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=slider--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Slider!');
    });
});
