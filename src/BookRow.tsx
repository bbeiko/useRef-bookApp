import React from "react";
import { BookToRead } from './BookToRead';

  //onMemoChangeはメモ項目の変更イベントのコールバック
  //onDeleteは書籍削除イベントのコールバック
type BookRowProps = {
  book : BookToRead;
  onMemoChange : (id: number, memo: string) => void;
  onDelete: (id: number) => void;
};

//propsで受け取ったプロパティを用いてレンダリングを行い、子コンポーネントでonChangeやonClickなどのイベントが発生した際はpropsのプロパティを通じて親コンポーネントにイベントを伝搬します。
const BookRow = (props: BookRowProps) => {
  const { title, authors, memo } = props.book;

  const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onMemoChange(props.book.id, e.target.value);
  };

  const handleDeleteClick = () => {
    props.onDelete(props.book.id);
  };

  return (
    <div className="book-row">
      <div title={title} className="title">
        {title}
      </div>
      <div title={authors} className="authors">
        {authors}
      </div>
      <input
        type="text"
        className="memo"
        value={memo}
        onChange={handleMemoChange}
      />
      <div className="delete-row" onClick={handleDeleteClick}>
        削除
      </div>
    </div>
  );
};

export default BookRow;