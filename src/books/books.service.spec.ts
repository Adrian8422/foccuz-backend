import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

describe('BooksService', () => {
  let service: BooksService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchBooks', () => {
    it('should return a list of books', async () => {
      const mockResponse = {
        data: {
          library: [
            {
              book: {
                ISBN: '123',
                author: { name: 'Author 1' },
                title: 'Book 1',
              },
            },
            {
              book: {
                ISBN: '456',
                author: { name: 'Author 2' },
                title: 'Book 2',
              },
            },
          ],
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse)); // Mock the http request

      const result = await service.fetchBooks();
      expect(result).toEqual(
        mockResponse.data.library.map((item) => item.book),
      );
    });

    it('should throw an error if HTTP request fails', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('Error fetching books')),
      );

      try {
        await service.fetchBooks();
      } catch (error) {
        expect(error.response).toBe('Error fetching books');
        expect(error.status).toBe(400);
      }
    });
  });

  describe('getAllBooks', () => {
    it('should return a list of books', async () => {
      const books = [
        { ISBN: '123', author: { name: 'Author 1' }, title: 'Book 1' },
      ];
      service.fetchBooks = jest.fn().mockResolvedValue(books);

      const result = await service.getAllBooks();
      expect(result).toEqual(books);
    });

    it('should throw an error if no books are found', async () => {
      service.fetchBooks = jest.fn().mockResolvedValue([]);

      try {
        await service.getAllBooks();
      } catch (error) {
        expect(error.response).toBe('The list is empty');
        expect(error.status).toBe(404);
      }
    });
  });

  describe('getBookByISBN', () => {
    it('should return a book by ISBN', async () => {
      const books = [
        { ISBN: '123', author: { name: 'Author 1' }, title: 'Book 1' },
      ];
      service.fetchBooks = jest.fn().mockResolvedValue(books);

      const result = await service.getBookByISBN('123');
      expect(result).toEqual(books[0]);
    });

    it('should throw an error if the book is not found by ISBN', async () => {
      const books = [
        { ISBN: '123', author: { name: 'Author 1' }, title: 'Book 1' },
      ];
      service.fetchBooks = jest.fn().mockResolvedValue(books);

      try {
        await service.getBookByISBN('999');
      } catch (error) {
        expect(error.response).toBe('Book not found');
        expect(error.status).toBe(404);
      }
    });
  });

  describe('getBooksByAuthor', () => {
    it('should return books by author', async () => {
      const books = [
        { ISBN: '123', author: { name: 'Author 1' }, title: 'Book 1' },
        { ISBN: '456', author: { name: 'Author 2' }, title: 'Book 2' },
      ];
      service.fetchBooks = jest.fn().mockResolvedValue(books);

      const result = await service.getBooksByAuthor('Author 1');
      expect(result).toEqual([books[0]]);
    });

    it('should throw an error if no books are found for the author', async () => {
      const books = [
        { ISBN: '123', author: { name: 'Author 1' }, title: 'Book 1' },
      ];
      service.fetchBooks = jest.fn().mockResolvedValue(books);

      try {
        await service.getBooksByAuthor('Unknown Author');
      } catch (error) {
        expect(error.response).toBe('No books found for this author');
        expect(error.status).toBe(404);
      }
    });
  });
});
