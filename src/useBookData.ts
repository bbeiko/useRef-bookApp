import { useEffect, useState } from "react";
import { BookDescription } from "./BookDescription";

//Google Books APIsを用いた書籍検索処理。API呼び出し、データ解析用のヘルパ関数を移動します。
function buildSearchUrl(
  title: string,
  author: string,
  maxResults: number
): string {
  let url = "https://www.googleapis.com/books/v1/volumes?q=";
  const conditions: string[] = [];
  if (title) {
    conditions.push(`intitle:${title}`);
  }
  if (author) {
    conditions.push(`inauthor:${author}`);
  }
  return url + conditions.join("+") + `&maxResults=${maxResults}`;
}

function extractBooks(json: any): BookDescription[] {
  const items: any[] = json.items;
  return items.map((item: any) => {
    const volumeInfo: any = item.volumeInfo;
    return {
      title: volumeInfo.title,
      authors: volumeInfo.authors ? volumeInfo.authors.join(", ") : "",
      thumbnail: volumeInfo.imageLinks
        ? volumeInfo.imageLinks.smallThumbnail
        : ""
    };
  });
}

//useBookDataがカスタムフック。第二引数の配列の中身が更新されるとBookSearchDialog.tsxにてこのカスタムフックが発火。
export const useBookData = (
  title: string,
  author: string,
  maxResults: number
) => {
  const [books, setBooks] = useState([] as BookDescription[]);

  //fetch関数によるAPIコール(Ajax)、結果のJSONから書籍のデータを抽出、setBooks関数によるステート変数booksの更新
  //if内の条件はtitle または author が空でないこと
  useEffect(() => {
    if (title || author) {
      const url = buildSearchUrl(title, author, maxResults);
      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          return extractBooks(json);
        })
        .then((books) => {
          setBooks(books);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [title, author, maxResults]);

  return books;
};
