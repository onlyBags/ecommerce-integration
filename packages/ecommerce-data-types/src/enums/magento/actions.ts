export enum MgActions {
  GET_PRODUCTS = 'products?searchCriteria[pageSize]=100',
  GET_PRODUCTS_ATTRIBUTES = 'products/attributes?searchCriteria[pageSize]=100',
  GET_CATEGORIES = 'categories?searchCriteria[pageSize]=100',
  GET_CATEGORIES_LIST = 'categories/list?searchCriteria[pageSize]=100',
  POST_ORDER = 'order',
  PAYMENT_METHODS = 'payments-config/usd',
  GET_PRODUCT_DETAIL = 'products',
}
