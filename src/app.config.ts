export const services = () => ({
  eligibility: {
    name: 'eligibility',
    alias: 'cancanta',
    baseUrl: process.env.ELIGIBILITY_BASE_URL,
    slug: '',
  },
  transfer: {
    name: 'transfer',
    alias: 'moueve',
    baseUrl: process.env.TRANSFER_BASE_URL,
    slug: '',
  },
  loan: {
    name: 'loan',
    alias: 'bashi',
    baseUrl: process.env.LOAN_BASE_URL,
    slug: '',
  },
  'wallet-interest': {
    name: 'wallet interest',
    alias: 'kolo interest',
    baseUrl: process.env.WALLET_INTEREST_BASE_URL,
    slug: '',
  },
  marketplace: {
    name: 'marketplace',
    alias: 'care',
    baseUrl: process.env.MARKETPLACE_BASE_URL,
    slug: '',
  },
  card: {
    name: 'card',
    alias: '',
    baseUrl: process.env.CARD_BASE_URL,
    slug: '',
  },
  account: {
    name: 'account generation service',
    alias: '',
    baseUrl: process.env.ACCOUNT_GENERATION_BASE_URL,
    slug: '',
  },
  wallet: {
    name: 'wallet',
    alias: 'kolo',
    baseUrl: process.env.WALLET_BASE_URL,
    slug: '',
  },
  cards: {
    name: 'cards',
    alias: '',
    baseUrl: process.env.CARDS_BASE_URL,
    slug: '',
  },
  settlement: {
    name: 'settlement',
    alias: '',
    baseUrl: process.env.SETTLEMENT_BASE_URL,
    slug: '',
  },
  bill: {
    name: 'bill',
    alias: '',
    baseUrl: process.env.BILL_BASE_URL,
    slug: '',
  },
  'bank-statement': {
    name: 'bank statement',
    alias: '',
    baseUrl: process.env.BANK_STATEMENT_BASE_URL,
    slug: '',
  },
  faq: {
    name: 'faq',
    alias: '',
    baseUrl: process.env.FAQ_BASE_URL,
    slug: '',
  },
  pwa: {
    name: 'pwa',
    alias: '',
    baseUrl: process.env.PWA_BASE_URL,
    slug: '',
  },
  merchant: {
    name: 'merchant',
    alias: '',
    baseUrl: process.env.MERCHANT_BASE_URL,
    slug: '',
  },
});

export const openServices = () => ([
  'faq',
  'pwa',
])

export const openEndpoints = () => ([
  {
    method: 'get',
    pattern: 'cards/isw/*',
  },
  {
    method: 'post',
    pattern: 'cards/isw/*',
  },
  {
    method: 'get',
    pattern: 'merchant/api/*',
  },
  {
    method: 'post',
    pattern: 'merchant/api/*',
  },
  {
    method: 'patch',
    pattern: 'merchant/api/*',
  },
  {
    method: 'put',
    pattern: 'merchant/api/*',
  },
  {
    method: 'delete',
    pattern: 'merchant/api/*',
  },
])

export const endpointsRequiringPin = () => ([
  {
    method: 'post',
    pattern: 'transfer/disburse',
  },
  {
    method: 'post',
    pattern: 'transfer/p2p',
  },
  {
    method: 'post',
    pattern: 'bill/airtime',
  },
  {
    method: 'post',
    pattern: 'bill/data',
  },
  {
    method: 'post',
    pattern: 'bill/dstv',
  },
  {
    method: 'post',
    pattern: 'bill/gotv',
  },
  {
    method: 'post',
    pattern: 'bill/electricity',
  },
  {
    method: 'post',
    pattern: 'bill/internet',
  },
  {
    method: 'post',
    pattern: 'settlement/fund',
  },
  {
    method: 'post',
    pattern: 'settlement/repayment',
  },
  {
    method: 'post',
    pattern: 'settlement/new-insurance',
  },
  {
    method: 'patch',
    pattern: 'plans/.*/activate',
  },
  {
    method: 'post',
    pattern: 'cards/create',
  },
  {
    method: 'get',
    pattern: 'cards/.*/detail',
  },
  {
    method: 'post',
    pattern: 'cards/.*/fund',
  },
  {
    method: 'patch',
    pattern: 'cards/.*/activate',
  },
  {
    method: 'patch',
    pattern: 'cards/.*/deactivate',
  },
  {
    method: 'delete',
    pattern: 'cards/.*/delete',
  },
  {
    method: 'patch',
    pattern: 'cards/.*/preference',
  },
  {
    method: 'post',
    pattern: 'cards/.*/reset-pin',
  },
])

export const endpointsRequiringAdmin = () => ([
  {
    method: 'post',
    pattern: 'wallet/*',
  },
])