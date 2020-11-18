import React from 'react';
import defaultDataset from "./dataset";
import './assets/styles/style.css'
// 関数のimportは{}で囲む エントリポイントを用意すると１行で複数コンポーネントがimportできる
import {AnswersList, Chats} from './components/index'

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
    this.selectAnswer = this.selectAnswer.bind(this)
  }

  displayNextQuestion = (nextQuestionId) => {
    const chats = this.state.chats;
    chats.push({
      text: this.state.dataset[nextQuestionId].question,
      type: 'question'
    })

    this.setState({
      answers: this.state.dataset[nextQuestionId].answers,
      chats: chats,
      currentId: nextQuestionId
    })
  }

  selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch(true) {
      case (nextQuestionId === 'init') :
        this.displayNextQuestion(nextQuestionId);
        break;
      default :
        const chats = this.state.chats;
        chats.push({
          text: selectedAnswer,
          type: 'answer'
        })
    
        this.setState({
          chats: chats
        });

        // 回答を送信後、次の質問を表示
        this.displayNextQuestion(nextQuestionId);
        break;
    }
  }

  // // dataset.jsからinitのanswersを取得
  // initAnswer = () => {
  //   const initDataset = this.state.dataset[this.state.currentId];
  //   const initAnswers = initDataset.answers;

  //   this.setState({
  //     answers: initAnswers
  //   });
  // }

  // initChats = () => {
  //   const initDataset = this.state.dataset[this.state.currentId];
  //   const chat = {
  //     text: initDataset.question,
  //     type: 'question'
  //   }

  //   // 一度stateを取得し、新しい配列を作成してからsetStateする
  //   const chats = this.state.chats;
  //   chats.push(chat)

  //   this.setState({
  //     chats: chats
  //   });
  // }

  // 最初のレンダーが終わったら一度だけinitAnswerを実行してstateを書き換える
  componentDidMount() {
    const initAnswer = "";
    this.selectAnswer(initAnswer, this.state.currentId);
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList answers={this.state.answers} select={this.selectAnswer} />
        </div>
      </section>
    );
  }
}
