import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  async getBooks() {
    return await this.booksService.getAllBooks();
  }
  @Get('author')
  async getBookByAuthor(@Query('search') search: string) {
    return await this.booksService.getBooksByAuthor(search);
  }
  @Get(':ISBN')
  async getBookByISBN(@Param('ISBN') isbn: string) {
    return await this.booksService.getBookByISBN(isbn);
  }
}
