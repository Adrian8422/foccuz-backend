import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Book } from './interfaces/book.interface';
@Injectable()
export class BooksService {
  private readonly apiExternal =
    'https://gitlab.com/-/snippets/4789289/raw/main/data.json';
  constructor(private httpService: HttpService) {}

  async fetchBooks(): Promise<Book[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.apiExternal),
      );
      return response.data.library.map((item: { book: Book }) => item.book);
    } catch (error) {
      throw new HttpException('Error fetching books', HttpStatus.BAD_REQUEST);
    }
  }
  async getAllBooks():Promise<Book[]> {
    try {
      return await this.fetchBooks();
    } catch (error) {
      throw new HttpException('The list is empty', HttpStatus.NOT_FOUND);
    }
  }
  async getBookByISBN(isbn: string):Promise<Book> {
    try {
      const books = await this.fetchBooks();

      const book = await books.find((b) => b.ISBN == isbn);

      if (!book)
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);

      return book;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async getBooksByAuthor(search: string):Promise<Book[]> {
    try {
      const books = await this.fetchBooks();

      const filteredBooks = books.filter((b) =>
        b.author.name.toLowerCase().includes(search.toLowerCase()),
      );

      if (filteredBooks.length === 0) {
        throw new HttpException(
          'No books found for this author',
          HttpStatus.NOT_FOUND,
        );
      }

      return filteredBooks;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
