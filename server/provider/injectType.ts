const injectType = {
  TagDB: Symbol('TagDB'),

  TopCategoryDao: Symbol('TopCategoryDao'),
  SecondCategoryDao: Symbol('SecondCategoryDao'),
  TagDao: Symbol('TagDao'),

  TopCategoryService: Symbol('TopCategoryService'),
  SecondCategoryService: Symbol('SecondCategoryService'),
  TagService: Symbol('TagService'),
  TagExplanationService: Symbol('TagExplanationService'),
  ClientService: Symbol('ClientService'),

  AuthController: Symbol('AuthController'),
  TagExplanationController: Symbol('TagExplanationController'),
  OpenInVscodeController: Symbol('OpenInVscodeController'),
  TopCategoryController: Symbol('TopCategoryController'),
  SecondCategoryController: Symbol('SecondCategoryController'),
  TagController: Symbol('TagController'),
};


export default injectType;