import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [BooksModule, HttpModule],
})
export class AppModule {}
