import React, {useState, useEffect, useCallback} from 'react';
import './assets/styles/style.css'
// 関数のimportは{}で囲む エントリポイントを用意すると１行で複数コンポーネントがimportできる
import {AnswersList, Chats} from './components/index'
import FormDialog from './components/Forms/FormDialog';
import {db} from './firebase/index'

const App = () => {
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState("init");
  const [dataset, setDataset] = useState({});
  const [open, setOpen] = useState(false);

  const addChats = (chat) => {
    // prevChats → 前回のchatsの状態の引数
    setChats(prevChats => {
      // 前回の状態にプラス今回の追加分を合わせてreturn
      return [...prevChats, chat]
    })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen]);

  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: 'question'
    });

    setAnswers(nextDataset.answers);
    setCurrentId(nextQuestionId);
  }

  const selectAnswer = useCallback((selectedAnswer, nextQuestionId) => {
    switch(true) {
      case (/^https:*/.test(nextQuestionId)) :
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_blank';
        a.click();
        break;

      case (nextQuestionId === 'contact') :
        handleClickOpen()
        break;

      default :
        addChats({
          text: selectedAnswer,
          type: 'answer'
        })

        // 回答を送信後、次の質問を表示 delayを与える
        setTimeout(() => {displayNextQuestion(nextQuestionId, dataset[nextQuestionId])},1000);
        break;
    }
  }, [answers])

  // 最初のレンダーが終わったら一度だけinitAnswerを実行してstateを書き換える
  useEffect(() => {
    (async() => {
      const initDataset = {};

      // snapshots => firestoreから取得したコレクションの一覧
      await db.collection('questions').get().then(snapshots => {
        snapshots.forEach(doc => {
          const id = doc.id
          const data = doc.data()
          initDataset[id] = data
        })
      }).catch(error => {
        console.log(error)
      })

      // 一番最初の質問表示はselectAnswerは使わない。データストアから持ってこない
      setDataset(initDataset)
      displayNextQuestion(currentId, initDataset[currentId]);
    })()
  }, [])

  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area')
    if(scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  })

  
  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList answers={answers} select={selectAnswer} />
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
}

export default App
