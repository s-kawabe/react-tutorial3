import React from 'react';
import './assets/styles/style.css'
// 関数のimportは{}で囲む エントリポイントを用意すると１行で複数コンポーネントがimportできる
import {AnswersList, Chats} from './components/index'
import FormDialog from './components/Forms/FormDialog';
import {db} from './firebase/index'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      chats: [],
      currentId: "init",
      dataset: {},
      open: false
    }
    // 関数をバインド 別コンポーネントに渡すコールバック関数をconstructor内でバインドさせるといい
    this.selectAnswer = this.selectAnswer.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
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
        setTimeout(() => {this.displayNextQuestion(nextQuestionId)},500);
        break;

      case (/^https:*/.test(nextQuestionId)) :
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_blank';
        a.click();
        break;

      case (nextQuestionId === 'contact') :
        this.handleClickOpen()
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

        // 回答を送信後、次の質問を表示 delayを与える
        setTimeout(() => {this.displayNextQuestion(nextQuestionId)},1000);
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

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  initDataset = (dataset) => {
    this.setState({dataset: dataset})
  }

  // 最初のレンダーが終わったら一度だけinitAnswerを実行してstateを書き換える
  componentDidMount() {
    (async() => {
      const dataset = this.state.dataset

      // snapshots => firestoreから取得したコレクションの一覧
      await db.collection('questions').get().then(snapshots => {
        snapshots.forEach(doc => {
          const id = doc.id
          const data = doc.data()
          dataset[id] = data
        })
      }).catch(error => {
        console.log(error)
      })

      this.initDataset(dataset)
      const initAnswer = "";
      this.selectAnswer(initAnswer, this.state.currentId)
    })()
  }

  componentDidUpdate() {
    const scrollArea = document.getElementById('scroll-area')
    if(scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList answers={this.state.answers} select={this.selectAnswer} />
          <FormDialog open={this.state.open} handleClose={this.handleClose} />
        </div>
      </section>
    );
  }
}
