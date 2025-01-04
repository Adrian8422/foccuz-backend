import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    getAllBooks: jest.fn(),
    getBooksByAuthor: jest.fn(),
    getBookByISBN: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: mockBooksService }],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBooks', () => {
    it('should return a list of books', async () => {
      const mockBooks = [
        { ISBN: '123', title: 'Book 1', author: { name: 'Author 1' } },
      ];
      mockBooksService.getAllBooks.mockResolvedValue(mockBooks);

      const result = await controller.getBooks();
      expect(result).toEqual(mockBooks);
      expect(mockBooksService.getAllBooks).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBookByAuthor', () => {
    it('should return books by author', async () => {
      const mockBooks = [
        { ISBN: '123', title: 'Book 1', author: { name: 'Author 1' } },
      ];
      const searchQuery = 'Author 1';
      mockBooksService.getBooksByAuthor.mockResolvedValue(mockBooks);

      const result = await controller.getBookByAuthor(searchQuery);
      expect(result).toEqual(mockBooks);
      expect(mockBooksService.getBooksByAuthor).toHaveBeenCalledWith(
        searchQuery,
      );
    });
  });

  describe('getBookByISBN', () => {
    it('should return a book by ISBN', async () => {
      const mockBook = {
        ISBN: '123',
        title: 'Book 1',
        author: { name: 'Author 1' },
      };
      const isbnParam = '123';
      mockBooksService.getBookByISBN.mockResolvedValue(mockBook);

      const result = await controller.getBookByISBN(isbnParam);
      expect(result).toEqual(mockBook);
      expect(mockBooksService.getBookByISBN).toHaveBeenCalledWith(isbnParam);
    });
  });
});
