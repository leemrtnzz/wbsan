import { createSignal, createEffect, onMount, For, Show } from "solid-js";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  method: string;
  date: string;
  timestamp: number;
}

export default function SpendingApp() {
  const [payments, setPayments] = createSignal<Record<string, number>>({
    cash: 0,
    bri: 0,
    jago: 0,
    btn: 0
  });
  
  const [transactions, setTransactions] = createSignal<Transaction[]>([]);
  
  const [newMethodName, setNewMethodName] = createSignal('');
  const [newMethodBalance, setNewMethodBalance] = createSignal(0);
  const [editingKey, setEditingKey] = createSignal<string | null>(null);

  const [txDescription, setTxDescription] = createSignal('');
  const [txAmount, setTxAmount] = createSignal<string>('0');
  const [txType, setTxType] = createSignal<'income' | 'expense'>('expense');
  const [txDate, setTxDate] = createSignal(new Date().toISOString().split('T')[0]);
  const [txMethod, setTxMethod] = createSignal('');

  onMount(() => {
    const savedPayments = localStorage.getItem('payments');
    const savedTransactions = localStorage.getItem('transactions');
    
    if (savedPayments) setPayments(JSON.parse(savedPayments));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    
    setTimeout(() => {
      const methods = Object.keys(payments());
      if (methods.length > 0 && !txMethod()) {
        setTxMethod(methods[0]);
      }
    }, 0);
  });

  createEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('payments', JSON.stringify(payments()));
      localStorage.setItem('transactions', JSON.stringify(transactions()));
    }
  });

  const addOrEditMethod = () => {
    const name = newMethodName().trim();
    if (!name) return;

    const newKey = name.toLowerCase().replace(/\s+/g, '');
    const editKey = editingKey();

    if (editKey) {
      // Edit mode
      if (newKey !== editKey && payments()[newKey] !== undefined) {
        alert(`Method ${name} already exists!`);
        return;
      }

      setPayments(prev => {
        const updated = { ...prev, [newKey]: Number(newMethodBalance()) };
        if (newKey !== editKey) {
          delete updated[editKey];
        }
        return updated;
      });
      
      setEditingKey(null);
    } else {
      // Add mode
      if (payments()[newKey] !== undefined) {
        alert(`${name} already exists!`);
        return;
      }
      
      setPayments(prev => ({
        ...prev,
        [newKey]: Number(newMethodBalance()) || 0
      }));
    }
    
    setNewMethodName('');
    setNewMethodBalance(0);
  };

  const startEdit = (key: string) => {
    setEditingKey(key);
    setNewMethodName(key);
    setNewMethodBalance(payments()[key]);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setNewMethodName('');
    setNewMethodBalance(0);
  };

  const deleteMethod = (key: string) => {
    const balance = payments()[key];
    if (balance !== 0) {
      alert(`Cannot delete ${key.toUpperCase()} with non-zero balance. Balance: Rp. ${balance.toLocaleString()}`);
      return;
    }
    
    setPayments(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const addTransaction = () => {
    const amount = Number(txAmount());
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const method = txMethod();
    if (!method) {
      alert('Please select a payment method');
      return;
    }

    if (txType() === 'expense') {
      const currentBalance = payments()[method];
      if (currentBalance < amount) {
        alert(`Insufficient funds in ${method.toUpperCase()}. Current balance: Rp. ${currentBalance.toLocaleString()}`);
        return;
      }
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      description: txDescription().trim(),
      amount: amount,
      type: txType(),
      method: method,
      date: txDate(),
      timestamp: Date.now()
    };

    setPayments(prev => ({
      ...prev,
      [method]: prev[method] + (txType() === 'income' ? amount : -amount)
    }));

    setTransactions(prev => [transaction, ...prev]);

    setTxDescription('');
    setTxAmount('0');
    setTxDate(new Date().toISOString().split('T')[0]);
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions().find(t => t.id === id);
    if (!tx) return;

    setPayments(prev => ({
      ...prev,
      [tx.method]: prev[tx.method] + (tx.type === 'income' ? -tx.amount : tx.amount)
    }));

    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const totalBalance = () => Object.values(payments()).reduce((sum, val) => sum + val, 0);

  return (
    <div class="min-h-screen bg-red-300 p-6">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold text-red-800 mb-8 text-center">💰 Financial Tracker</h1>
        
        {/* Total Balance Card */}
        <div class="bg-linear-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <p class="text-lg opacity-90 mb-2">Total Balance</p>
          <p class="text-5xl font-bold">Rp. {totalBalance().toLocaleString()}</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 mb-8">
          {/* Payment Methods Section */}
          <section class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h2>
            
            <div class="space-y-3 mb-6">
              <For each={Object.entries(payments())}>
                {([key, balance]) => (
                  <div class={`p-4 rounded-xl border-2 transition-all ${editingKey() === key ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div class="flex justify-between items-center">
                      <div>
                        <p class="font-semibold text-gray-800 uppercase text-lg">{key}</p>
                        <p class="text-2xl font-bold text-indigo-600">Rp. {balance.toLocaleString()}</p>
                      </div>
                      <div class="flex gap-2">
                        <button 
                          onclick={() => startEdit(key)}
                          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onclick={() => deleteMethod(key)}
                          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>

            <div class="space-y-4">
              <Show when={editingKey()}>
                <div class="bg-amber-50 border-2 border-amber-400 rounded-lg p-3 mb-4">
                  <p class="text-amber-800 font-semibold">✏️ Editing: {editingKey()?.toUpperCase()}</p>
                </div>
              </Show>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Method Name</label>
                <input
                  type="text"
                  value={newMethodName()}
                  oninput={(e) => setNewMethodName(e.currentTarget.value)}
                  placeholder="e.g. BCA, Gopay"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Balance</label>
                <input
                  type="number"
                  value={newMethodBalance()}
                  oninput={(e) => setNewMethodBalance(Number(e.currentTarget.value))}
                  placeholder="0"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
              
              <div class="flex gap-3">
                <button 
                  onclick={addOrEditMethod}
                  class="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingKey() ? '💾 Save Changes' : '➕ Add Method'}
                </button>
                
                <Show when={editingKey()}>
                  <button 
                    onclick={cancelEdit}
                    class="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </Show>
              </div>
            </div>
          </section>

          {/* Add Transaction Section */}
          <section class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={txDescription()}
                  oninput={(e) => setTxDescription(e.currentTarget.value)}
                  placeholder="e.g. Lunch at restaurant"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={txAmount()}
                  oninput={(e) => setTxAmount(e.currentTarget.value)}
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select 
                  value={txType()} 
                  onchange={(e) => setTxType(e.currentTarget.value as 'income' | 'expense')}
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                >
                  <option value="expense">💸 Expense (Out)</option>
                  <option value="income">💰 Income (In)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={txDate()}
                  oninput={(e) => setTxDate(e.currentTarget.value)}
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <select 
                  value={txMethod()}
                  onchange={(e) => setTxMethod(e.currentTarget.value)}
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                >
                  <option value="" disabled>Select method</option>
                  <For each={Object.keys(payments())}>
                    {key => <option value={key}>{key.toUpperCase()}</option>}
                  </For>
                </select>
              </div>

              <button 
                onclick={addTransaction}
                class="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                ✅ Add Transaction
              </button>
            </div>
          </section>
        </div>

        {/* Transactions Table */}
        <section class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
          
          <Show 
            when={transactions().length > 0}
            fallback={
              <div class="text-center py-12">
                <p class="text-gray-400 text-lg">📝 No transactions yet. Add your first transaction above.</p>
              </div>
            }
          >
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                    <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Type</th>
                    <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Method</th>
                    <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={transactions().sort((a, b) => b.timestamp - a.timestamp)}>
                    {tx => (
                      <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-3 text-sm text-gray-600">
                          {new Date(tx.date).toLocaleDateString('id-ID', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-800 font-medium">{tx.description}</td>
                        <td class="px-4 py-3 text-right">
                          <span class={`font-bold ${tx.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                            {tx.type === 'expense' ? '-' : '+'}Rp. {tx.amount.toLocaleString()}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <span class={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.type === 'expense' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {tx.type === 'expense' ? '💸 OUT' : '💰 IN'}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold uppercase">
                            {tx.method}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <button 
                            onclick={() => deleteTransaction(tx.id)}
                            class="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        </section>
      </div>
    </div>
  );
}
