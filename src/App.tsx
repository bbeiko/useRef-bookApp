import React, { useEffect, useState } from "react";
import "./App.css";
import { BookToRead } from "./BookToRead";
import { BookDescription } from "./BookDescription";
import BookRow from "./BookRow"
import Modal from "react-modal";
import BookSearchDialog from "./BookSearchDialog";

//モーダル表示時にオーバーレイで覆うDOM領域を指定します。
Modal.setAppElement("#root");

//モーダルダイアログおよびオーバーレイの外観のスタイル設定となります。
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)"
  },
  contentColor: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: 0,
    transform: "translate(-50%, -50%)"
  }
};

//ブラウザをリロードしても書籍リストが消えてしまわないように、LocalStorageにデータを保存するように実装しましょう。
//LocalStorageへのアクセスキーを定数定義します。
const APP_KEY = "react-hooks-tutorial";

//modalIsOpenにて「モーダルダイアログが開いているかどうか」という画面モードをステート変数として持たせて切り替えを行います。
const App = () => {
  const [books, setBooks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  //下のuseEffectで行った処理を読み込む。※下のuseEffectより先に書く。下のコードを先に書くとリロードによって値がリセットされたものができてしまい、それでBooksを更新することになってしまうため。
  useEffect(() => {
    const storedBooks = localStorage.getItem(APP_KEY);
    if(storedBooks){
      setBooks(JSON.parse(storedBooks));
    }
  },[]);

  //books配列を文字列化した値をLocalStorageに書き込む処理
  useEffect(()=> {
    localStorage.setItem(APP_KEY, JSON.stringify(books));
  },[books]);

  //booksに格納されている書籍データの配列のうち、IDが合致する要素はメモを更新した値を、それ以外の要素はそのままの値で新しい配列に格納します。
  //上のコードは、bの各プロパティを展開し、memoプロパティだけを上書きした新しいオブジェクトを生成しています。
  const handleBookMemoChange = (id: number, memo: string) => {
    const newBooks = books.map((b) => {
      return b.id === id ? { ...b, memo: memo}
      : b;
    });
    setBooks(newBooks);
  };

  const handleBookDelete = (id: number) => {
    const newBooks = books.filter((b) => b.id !== id);
    setBooks(newBooks);
  };

  //「本を追加」ボタンのクリックに対するものなので、モーダルダイアログを開くためにsetModalIsOpenにtrueを指定します
  const handleAddClick = () => {
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleBookAdd = (book: BookDescription) => {
    const newBook: BookToRead = { ...book, id: Date.now(), memo: ""};
    const newBooks = [ ...books, newBook ];
    setBooks(newBooks);
    setModalIsOpen(false);
  };

  const bookRows = books.map((book) => {
    return (
      <BookRow
        book={book}
        key={book.id}
        onMemoChange={(id, memo) => handleBookMemoChange(id, memo)}
        onDelete={(id) => handleBookDelete(id)}
      />
    );
  });

  return (
    <div className="App">
      <section className="nav">
        <h1>読みたい本リスト</h1>
        <div className="button-like" onClick={handleAddClick}>
          本を追加
        </div>
      </section>
      <section className="main">{bookRows}</section>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={customStyles}
      >
        <BookSearchDialog maxResults={20} onBookAdd={(b) => handleBookAdd(b)} />
      </Modal>
    </div>
  );
};

export default App;
