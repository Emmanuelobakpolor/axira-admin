export const topMetrics = [
  { title: 'Total Users', value: 'N 5,234', trend: '+10.0%', accent: '#10b981', link: 'View All', icon: 'users' },
  { title: 'Total Deposit Today', value: 'N2,215', trend: '+10.0%', accent: '#10b981', link: 'View All', icon: 'deposit' },
  { title: 'NGN Deposit', value: 'N2,215', trend: '+10.0%', accent: '#3b82f6', link: 'View All', icon: 'ngn' },
  { title: 'Total Withdrawal', value: 'N1,789', trend: '+10.0%', accent: '#f59e0b', link: 'View All', icon: 'withdrawal' },
];

export const summaryMetrics = [
  { title: 'Total Swapped Crypto', value: '200,500.00', suffix: '$' },
  { title: 'Total Crypto Withdrawals', value: '100,500.00', suffix: 'USD' },
];

export const transactionStats = [
  { title: 'Swaps', count: 5, amount: '$243,8484.00' },
  { title: 'Deposit', count: 5, amount: '$243,8484.00' },
  { title: 'Withdrawals', count: 5, amount: '$243,8484.00' },
];

export const transactionFilters = ['Type', 'Swaps', 'Deposits', 'Withdrawals'];

export const transactions = [
  { id: 'TX-88201', type: 'Swap', user: 'Jane Jones', asset: 'ETH → BTC', amount: '$200.00', fee: '$41.25', status: 'Completed' },
  { id: 'TX-88201', type: 'Deposit', user: 'Jones John', asset: 'BTC', amount: '$200.00', fee: '$41.25', status: 'Completed' },
  { id: 'TX-88201', type: 'Withdrawal', user: 'Jane Jones', asset: 'ETH', amount: '$200.00', fee: '$41.25', status: 'Completed' },
  { id: 'TX-88201', type: 'Swap', user: 'Jane Jones', asset: 'ETH → BTC', amount: '$200.00', fee: '$41.25', status: 'Completed' },
  { id: 'TX-88201', type: 'Deposit', user: 'Jane Jones', asset: 'BTC', amount: '$200.00', fee: '$41.25', status: 'Completed' },
  { id: 'TX-88201', type: 'Withdrawal', user: 'Jane Jones', asset: 'ETH', amount: '$200.00', fee: '$41.25', status: 'Completed' },
  { id: 'TX-88201', type: 'Deposit', user: 'Jane Jones', asset: 'BTC', amount: '$200.00', fee: '$41.25', status: 'Completed' },
  { id: 'TX-88201', type: 'Swap', user: 'Jane Jones', asset: 'ETH → BTC', amount: '$200.00', fee: '$41.25', status: 'Completed' },
  { id: 'TX-88201', type: 'Deposit', user: 'Jane Jones', asset: 'BTC', amount: '$200.00', fee: '$41.25', status: 'Completed' },
];

export const userStats = [
  { label: 'Male', value: 30, color: '#2f86ff' },
  { label: 'Female', value: 0, color: '#f2ae43' },
  { label: 'Blacklisted', value: 0, color: '#dd3d53' },
];

export const users = Array.from({ length: 12 }, (_, index) => {
  const names = [
    'Jane Jones',
    'John Smith',
    'Amina Bello',
    'David Okon',
    'Sarah Ahmed',
    'Michael Eze',
    'Grace Musa',
    'Peter Okafor',
    'Fatima Yusuf',
    'Daniel Nwosu',
    'Rita Ade',
    'Emmanuel Cole',
  ];
  const statuses = ['Active', 'Active', 'Pending', 'Active', 'Blacklisted', 'Active', 'Pending', 'Active', 'Active', 'Blacklisted', 'Active', 'Pending'];
  const name = names[index % names.length];
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return {
    id: `user-${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
    phone: `+234 8${index + 1}${String(1234567 + index).padStart(7, '0')}`,
    profilePic: initials,
    balance: `$${(200 + index * 35).toFixed(2)}`,
    status: statuses[index % statuses.length],
    lastActive: `${index + 1} hours ago`,
    tag: index > 6 ? 'Female' : '',
  };
});

export const feeCards = [
  {
    title: 'Swap fee',
    heading: 'Swap Fee',
    description: 'Charged per swap on notional value',
    buttonLabel: 'Add Withdrawal Charge',
    values: ['10', '1'],
  },
  {
    title: 'Deposit fee',
    heading: 'Deposit fee',
    description: 'Flat Network fee plus percentage.',
    buttonLabel: 'Add Withdrawal Charge',
    values: ['1', '1'],
  },
  {
    title: 'Withdrawal fee',
    heading: 'Withdrawal fee',
    description: 'Flat Network fee plus a percentage.',
    buttonLabel: 'Add Withdrawal Charge',
    values: ['10', '1'],
  },
];
