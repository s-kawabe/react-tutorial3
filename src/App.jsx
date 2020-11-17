import React from 'react';
import defaultDataset from "./dataset";
import './assets/styles/style.css'
// 関数のimportは{}で囲む
import {AnswersList} from './components/index'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      chats: [],
      currentId: "init",
      dataset: defaultDataset,
      open: false
    }
  }

  // dataset.jsからinitのanswersを取得
  initAnswer = () => {
    const initDataset = this.state.dataset[this.state.currentId];
    const initAnswers = initDataset.answers;

    this.setState({
      answers: initAnswers
    });
  }

  // 最初のレンダーが終わったら一度だけinitAnswerを実行してstateを書き換える
  componentDidMount() {
    this.initAnswer()
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <AnswersList answers={this.state.answers} />
        </div>
      </section>
    );
  }
}
