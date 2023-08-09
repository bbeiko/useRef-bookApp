import React, { useEffect, useRef, useState } from "react";
import { BookDescription } from "./BookDescription";
import BookSearchItem from "./BookSearchItem";
import { useBookData } from "./useBookData";

type BookSearchDialogProps = {
  maxResults: number;
  onBookAdd: (book: BookDescription) => void;
};

//検索ボタンがクリックされ title または author の値が変わると、Reactによって BookSearchDialog コンポーネントの再レンダリングが実行される
//するとuseBookData関数が呼び出されるが、 その関数内のuseEffect の第2引数に指定しているtitle または author の値が前回と変わった時のみ、第1引数の関数が実行される
const BookSearchDialog = (props: BookSearchDialogProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);

  //下記で更新されたtitleとauthorをuseBookData（カスタムフック）にわたす。useBookData内のuseEffectにて[title, author, maxResults]が変更されたときにこの関数が発火するので、booksが更新される。
  //props.maxResultsはApp.tsxから渡された値
  const books = useBookData(title, author, props.maxResults);

  //検索ボタンクリックのハンドラ関数で、 title author のステート変数に値をセットする
  //current!はundefinedかnullの可能性があるものに対してnullでもundefinedでもないことを宣言できる。
  const handleSearchClick = () => {
    if (!titleRef.current!.value && !authorRef.current!.value) {
      alert("条件を入力してください");
      return;
    }
    //検索実行
    setTitle(titleRef.current!.value);
    setAuthor(authorRef.current!.value);
  };

  const handleBookAdd = (book: BookDescription) => {
    props.onBookAdd(book);
  };

  const bookItems = books.map((b, idx) => {
    return (
      <BookSearchItem
        description={b}
        onBookAdd={(b) => handleBookAdd(b)}
        key={idx}
      />
    );
  });

  //ref属性を指定することによりDOM要素とuseRefで取得したrefとが紐付けられます。
  //refはDOM要素への参照を保持するだけでなく、あらゆる書き換え可能な値を保持できる。また、その中身が変更になってもコンポーネントの再レンダリングは発生しません。
  return (
    <div className="dialog">
      <div className="operation">
        <div className="conditions">
          <input type="text" ref={titleRef} placeholder="タイトルで検索" />
          <input type="text" ref={authorRef} placeholder="著者名で検索" />
        </div>
        <div className="button-like" onClick={handleSearchClick}>
          検索
        </div>
      </div>
      <div className="search-results">{bookItems}</div>
    </div>
  );
};

export default BookSearchDialog;
