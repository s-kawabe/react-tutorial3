import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
// firestoreをadmin権限で操作したい時。 度々使用することになるので一次変数に保存
const db = admin.firestore();

const sendResponse = (response: functions.Response, statusCode: number, body: any) => {
  response.send({
    statusCode,
    body: JSON.stringify(body),
  })
}

// https.onRequestメソッドでAPI関数を作成
// exportは必ずつける。（外部からこれを叩きたい場合）
export const addDataset = functions.https.onRequest(async(req: any, res: any) => {
  if(req.method !== 'POST') {
    sendResponse(res, 405, {error: 'Invalid Request!'})
  } else {
    const dataset = req.body
    for(const key of Object.keys(dataset)) {
      const data = dataset[key]
      // questionsという名のcollection（データストア）を作成する
      await db.collection('questions').doc(key).set(data)
    }
    sendResponse(res, 200, {message: 'SUccessfully added dataset!'})
  }
})