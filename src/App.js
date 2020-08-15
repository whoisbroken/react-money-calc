import React, { Component } from 'react';
import Total from './components/total/Total';
import History from './components/history/History';
import Operation from './components/operation/Operation';


class App extends Component {

  state = {
    transactions: JSON.parse(localStorage.getItem('calcMoney')) || [],
    description: '',
    amount: '',
    resultIncome: 0,
    resultExpeses: 0,
    resultBalance: 0,
  };

  componentWillMount() {
    this.getTotalBalance();
  }

  componentDidUpdate() {
    this.addStorage();
  }

  addTransaction = add => {

    const transactions = [...this.state.transactions,
      {
        id: `cmr${(+new Date()).toString(16)}key`,
        description: this.state.description,
        amount: parseFloat(this.state.amount),
        add
      }
    ];
    
    this.setState({ 
      transactions,
      description: '',
      amount: '',
    }, this.getTotalBalance)
  }

  addAmount = e => {
    this.setState({amount: e.target.value});
  }

  addDescription = e => {
    this.setState({description: e.target.value});
  }

  getIncome = () => this.state.transactions
        .reduce((acc, item) => item.add ? item.amount + acc : acc, 0);

  getExpenses = () => this.state.transactions
        .reduce((acc,item) => !item.add ? item.amount + acc : acc, 0);

  getTotalBalance() {
    const resultIncome = this.getIncome(),
          resultExpeses = this.getExpenses(),
          totalBalance = resultIncome - resultExpeses;

    this.setState({
      totalBalance,
      resultIncome,
      resultExpeses,
    });
  }

  addStorage = () => {
    localStorage.setItem('calcMoney', JSON.stringify(this.state.transactions));
  };

  delTransaction = id => {
    const transactions = this.state.transactions.filter(item => item.id !== id);

    this.setState({ transactions }, this.getTotalBalance);
  }


  render() {
    return (
      <div>
        <header>
          <h1>Кошелек</h1>
          <h2>Калькулятор расходов</h2>
        </header>
  
        <main>
            <div className="container">
              <Total 
                totalBalance={this.state.totalBalance}
                resultIncome={this.state.resultIncome}
                resultExpeses={this.state.resultExpeses}
              />
              <History 
                transactions={this.state.transactions}
                delTransaction={this.delTransaction}
              />
              <Operation 
                addTransaction={this.addTransaction}
                addAmount={this.addAmount}
                addDescription={this.addDescription}
                amount={this.state.amount}
                description={this.state.description}
              />
            </div>
        </main>
      </div>
    )
  }
}

export default App;
