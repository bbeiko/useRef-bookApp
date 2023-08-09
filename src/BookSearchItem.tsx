import React from "react";
import { BookDescription } from "./BookDescription";

//APIで取得した書籍情報のうち、タイトル、著者(群)、サムネイル画像(のURL)を保持する型です。
//サムネイル画像の右下にある「＋」をクリックした際のイベントを拾うコールバック関数を含めたものが当コンポーネントのpropsとなります。
type BookSearchItemProps = {
  description: BookDescription;
  onBookAdd: (book: BookDescription) => void;
};

const BookSearchItem = (props: BookSearchItemProps) => {
  const { title, authors, thumbnail } = props.description;
  const handleAddBookClick = () => {
    props.onBookAdd(props.description);
  };

  return (
    <div className="book-search-item">
      <h2 title={title}>{title}</h2>
      <div className="authors" title={authors}>
        {authors}
      </div>
      {thumbnail ? <img src={thumbnail} alt="" /> : null}
      <div className="add-book" onClick={handleAddBookClick}>
        <span>+</span>
      </div>
    </div>
  );
};

export default BookSearchItem;
