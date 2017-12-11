import { AppERISPage } from './app.po';

describe('app-eris App', () => {
  let page: AppERISPage;

  beforeEach(() => {
    page = new AppERISPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
